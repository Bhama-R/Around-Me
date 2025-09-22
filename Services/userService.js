const User = require("../Schema/userSchema");
const Event = require("../Schema/eventSchema");
const Interest = require("../Schema/interestSchema");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// --- Utility: send verification email (stub) ---
async function sendVerificationEmail(email, token) {
  const link = `http://localhost:3000/api/users/verify/${token}`;
  console.log(`📩 Send this link to user: ${link}`);
  // TODO: integrate with nodemailer, SES, etc.
}

/**
 * ========================
 *  USER SERVICE FUNCTIONS
 * ========================
 */

// Register 
async function register(userData) {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already registered");

  const token = crypto.randomBytes(32).toString("hex");

  const newUser = new User({
    ...userData,
    role: "member", // default
    status: "blocked", // blocked until verification
    token,
    createdAt: new Date(),
  });

  await newUser.save();
  await sendVerificationEmail(newUser.email, token);

  return { status: true, data: { message: "Check your email for the verification link" } };
}

// --- Verify user (email token -> generate secure cookie) ---
async function verifyUser(token, res) {
  const foundUser = await User.findOne({ token });
  if (!foundUser) throw new Error("Invalid token");

  const tokenAge = Date.now() - new Date(foundUser.createdAt).getTime();
  if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
    throw new Error("Token expired, please login again");
  }

  foundUser.status = "active";
  foundUser.token = undefined;
  foundUser.cookieKey = crypto.randomBytes(16).toString("hex");
  await foundUser.save();

  const loginToken = jwt.sign(
    { id: foundUser._id, role: foundUser.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  // Set secure cookie
  res.cookie("auth", loginToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { status: true, data: { user: foundUser } };
}

// --- Login (only email, resend link if not active) ---
async function login(email, res) {
  const foundUser = await User.findOne({ email });
  if (!foundUser) throw new Error("User not found");

  if (foundUser.status !== "active") {
    return await resendVerification(email);
  }

  const token = jwt.sign(
    { id: foundUser._id, role: foundUser.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.cookie("auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { status: true, data: { user: foundUser } };
}

// --- Resend verification link ---
async function resendVerification(email) {
  const existingUser = await User.findOne({ email });
  if (!existingUser) throw new Error("User not found");

  if (existingUser.status === "active") {
    throw new Error("User already verified, please login");
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  existingUser.token = newToken;
  existingUser.createdAt = new Date();
  await existingUser.save();
  await sendVerificationEmail(existingUser.email, newToken);

  return { status: true, data: { message: "A new verification link has been sent to your email" } };
}

// --- Update Profile (members can edit own profile) ---
async function updateProfile(userId, updateData) {
  const updated = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return { status: true, data: updated };
}

// --- Deactivate Account (withdraw from events, block created events) ---
async function deactivateAccount(userId) {
  const userDoc = await User.findByIdAndUpdate(userId, { status: "inactive" }, { new: true });
  if (!userDoc) throw new Error("User not found");

  const createdEvents = await Event.find({ createdBy: userId });
  const interests = await Interest.find({ userId })
    .populate("eventId", "title startDate location status");

  // Block all events created by this user
  await Event.updateMany({ createdBy: userId }, { $set: { status: "blocked" } });

  // Withdraw all interests
  await Interest.updateMany(
    { userId, status: { $in: ["pending", "approved"] } },
    {
      $set: {
        status: "withdrawn",
        withdrawnAt: new Date(),
        withdrawReason: "User deactivated account",
      },
    }
  );

  return {
    status: true,
    data: {
      message: "Account deactivated successfully",
      deactivatedUser: userDoc,
      createdEvents: createdEvents.map(e => ({
        id: e._id,
        title: e.title,
        startDate: e.startDate,
        location: e.location.city,
        status: "blocked",
      })),
      withdrawnInterests: interests.map(i => ({
        eventId: i.eventId._id,
        title: i.eventId.title,
        startDate: i.eventId.startDate,
        status: "withdrawn",
      })),
    },
  };
}

// --- Get all users (admin only) ---
async function getAllUser() {
  return { status: true, data: await User.find() };
}

// --- Update role (admin only: promote member -> event_manager / admin) ---
async function updateRole(userId, role) {
  if (!["member", "event_manager", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }
  return { status: true, data: await User.findByIdAndUpdate(userId, { role }, { new: true }) };
}

/**
 * ========================
 *  MIDDLEWARE
 * ========================
 */

// --- Sliding session (refresh cookie on each request) ---
function refreshAuth(req, res, next) {
  const token = req.cookies?.auth;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Re-issue token (sliding session)
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.cookie("auth", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = decoded; // session auto set
  } catch (err) {
    console.log("Token expired or invalid");
  }

  next();
}

// --- Role-based access control middleware ---
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = {
  register,
  verifyUser,
  login,
  resendVerification,
  updateProfile,
  deactivateAccount,
  getAllUser,
  updateRole,
  refreshAuth,
  requireRole,
};

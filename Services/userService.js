const User = require("../Schema/userSchema");
const Event = require("../Schema/eventSchema");
const Interest = require("../Schema/interestSchema");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ======================================================
   📧 Send Verification Email
====================================================== */
async function sendVerificationEmail(email, token) {
  const link = `http://localhost:3000/users/verify/${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use true for 465 with SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     tls: {
      rejectUnauthorized: false, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    html: `<p>Click below to verify your account:</p>
           <a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📩 Verification email sent to ${email}`);
}

/* ======================================================
   📝 REGISTER USER
====================================================== */
async function register(userData) {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already registered");

  const token = crypto.randomBytes(32).toString("hex");

  const newUser = new User({
    ...userData,
    role: "member",
    status: "blocked",
    token,
    createdAt: new Date(),
  });

  await newUser.save();
  await sendVerificationEmail(newUser.email, token);

  return {
    status: true,
    data: { message: "Check your email for the verification link" },
  };
}

/* ======================================================
   ✅ VERIFY USER (Email Token)
====================================================== */
async function verifyUser(token, res) {
  const foundUser = await User.findOne({ token });
  if (!foundUser) throw new Error("Invalid token");

  const tokenAge = Date.now() - new Date(foundUser.createdAt).getTime();
  if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
    throw new Error("Token expired, please login again");
  }

  foundUser.status = "active";
  foundUser.cookieKey = crypto.randomBytes(16).toString("hex");
  await foundUser.save();

  const loginToken = jwt.sign(
    { id: foundUser._id, role: foundUser.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  // Set auth cookie
  res.cookie("auth", loginToken, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

   return res.redirect("http://localhost:5173/home");
}

/* ======================================================
   🔐 LOGIN (Email Only — Always Sends Verification Link)
====================================================== */
async function login(email, res) {
  console.log("📩 Login request received for:", email);

  const foundUser = await User.findOne({ email });
  if (!foundUser) throw new Error("User not found");

  // ✅ Always issue a new token, even if verified
  const newToken = crypto.randomBytes(32).toString("hex");
  foundUser.token = newToken;
  foundUser.createdAt = new Date();
  await foundUser.save();

  console.log("✅ Token updated in DB:", newToken);

  try {
    await sendVerificationEmail(foundUser.email, newToken);
    console.log("✅ Verification email sent to:", foundUser.email);
  } catch (err) {
    console.error("❌ Email send error:", err);
    throw new Error("Failed to send verification email");
  }

  return {
    status: true,
    data: {
      message:
        "A new verification link has been sent to your email. Please click it to log in.",
    },
  };
}


/* ======================================================
   🔄 RESEND VERIFICATION EMAIL
====================================================== */
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
  console.log("📩 Resent verification token:", newToken);

  return {
    status: true,
    data: { message: "A new verification link has been sent to your email" },
  };
}

/* ======================================================
   ✏️ UPDATE PROFILE
====================================================== */
async function updateProfile(userId, updateData) {
  const updated = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return { status: true, data: updated };
}

/* ======================================================
   🚫 DEACTIVATE ACCOUNT
====================================================== */
async function deactivateAccount(userId) {
  const userDoc = await User.findByIdAndUpdate(userId, { status: "inactive" }, { new: true });
  if (!userDoc) throw new Error("User not found");

  const createdEvents = await Event.find({ createdBy: userId });
  const interests = await Interest.find({ userId }).populate(
    "eventId",
    "title startDate location status"
  );

  // Block all user-created events
  await Event.updateMany({ createdBy: userId }, { $set: { status: "blocked" } });

  // Withdraw all event interests
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
      createdEvents: createdEvents.map((e) => ({
        id: e._id,
        title: e.title,
        startDate: e.startDate,
        location: e.location?.city,
        status: "blocked",
      })),
      withdrawnInterests: interests.map((i) => ({
        eventId: i.eventId._id,
        title: i.eventId.title,
        startDate: i.eventId.startDate,
        status: "withdrawn",
      })),
    },
  };
}

/* ======================================================
   👥 GET ALL USERS (Admin / Manager / Self)
====================================================== */
async function getAllUser(currentUser) {
  let users;

  if (currentUser.role === "admin") {
    users = await User.find();
  } else if (currentUser.role === "event_manager") {
    users = await User.find().select("name email role status");
  } else {
    users = await User.find({ _id: currentUser.id }).select("name email role status");
  }

  return { status: true, data: users };
}

/* ======================================================
   🧩 UPDATE ROLE (Admin only)
====================================================== */
async function updateRole(userId, role) {
  if (!["member", "event_manager", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }
  const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
  return { status: true, data: updatedUser };
}

/* ======================================================
   🚫 SUSPEND USER (Admin only)
====================================================== */
async function suspendUser(userId) {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: "suspended" },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return { status: true, message: "User suspended successfully", data: user };
}

/* ======================================================
   ✅ ACTIVATE USER (Admin only)
====================================================== */
async function activateUser(userId) {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: "active" },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return { status: true, message: "User activated successfully", data: user };
}

/* ======================================================
   🛡️ MIDDLEWARE
====================================================== */

function refreshAuth(req, res, next) {
  const token = req.cookies?.auth ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);
  if (!token) {
    console.log("❌ No auth cookie found");
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

  req.user = decoded;

    // Reissue new token for sliding session
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.cookie("auth", newToken, {
      httpOnly: true,
      secure: false, // ⚠️ keep false for localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


function requireRole(...roles) {
  return (req, res, next) => {
    console.log("🧭 Checking role:", req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ Access denied. Allowed:", roles, "Found:", req.user?.role);
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

/* ======================================================
   🔍 CHECK AUTH SERVICE
====================================================== */
async function checkAuth(req) {
  const token =
    req.cookies?.auth ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) throw new Error("No authentication token found");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    return { status: true, user: decoded };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
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
  suspendUser,
  activateUser,
  refreshAuth,
  requireRole,
  checkAuth
};

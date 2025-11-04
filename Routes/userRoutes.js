const express = require("express");
const router = express.Router();
const userSchema = require('../Schema/userSchema');
const userController = require("../Controllers/userController");
const { refreshAuth, requireRole } = require("../Services/userService");
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updateRoleValidation,
  validationRes,
} = require("../middleware/Validation/validation");

// Apply refreshAuth to all routes → auto refreshes session
router.use(refreshAuth);

router.get("/me", async (req, res) => {
  console.log("🍪 Cookies received:", req.cookies);
  console.log("👤 Decoded user:", req.user);
  if (!req.user) return res.status(401).json({ error: "Not logged in" });

  const user = await userSchema.findById(req.user.id).select("name role email");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});


// Public routes
router.post("/register", registerValidation, validationRes, userController.register);
router.get("/verify/:token", userController.verifyUser);
router.post("/login", loginValidation, validationRes, userController.login);
router.post("/resend-verification", userController.resendVerification);


// Protected routes
router.put("/profile/:id", updateProfileValidation, validationRes, userController.updateProfile);
router.put("/deactivate/:id", userController.deactivateAccount);

// Admin-only routes
router.get("/", requireRole("admin"), userController.getAllUser);
router.put("/role/:id",requireRole("admin"), validationRes, userController.updateRole);
router.put("/:id/suspend", requireRole("admin"), userController.suspendUser);
router.put("/:id/activate", requireRole("admin"), userController.activateUser);
router.get("/check-auth", userController.checkAuth);


module.exports = router;

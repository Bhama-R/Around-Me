const express = require("express");
const router = express.Router();
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

// Public routes
router.post("/register", registerValidation, validationRes, userController.register);
router.get("/verify/:token", userController.verifyUser);
router.post("/login", loginValidation, validationRes, userController.login);

// Protected routes
router.put("/profile/:id", updateProfileValidation, validationRes, userController.updateProfile);
router.put("/deactivate/:id", userController.deactivateAccount);

// Admin-only routes
router.get("/", requireRole("admin"), userController.getAllUser);
router.put("/role/:id", updateRoleValidation, validationRes, userController.updateRole);

module.exports = router;

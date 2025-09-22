const { check, body, validationResult } = require("express-validator");

/* ---------------- User Validations ---------------- */
const registerValidation = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
  check("mobile")
    .notEmpty().withMessage("Mobile is required")
    .matches(/^[0-9]{10}$/).withMessage("Mobile must be 10 digits"),
  check("city").notEmpty().withMessage("City is required"),
  check("role")
    .optional()
    .isIn(["member", "event_manager", "admin"])
    .withMessage("Invalid role"),
  check("gender")
    .optional()
    .isIn(["male", "female", "trans", "other"])
    .withMessage("Invalid gender"),
];

const loginValidation = [
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),
];

const updateProfileValidation = [
  check("name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  check("mobile")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile must be 10 digits"),
  check("city").optional().notEmpty().withMessage("City cannot be empty"),
  check("gender")
    .optional()
    .isIn(["male", "female", "trans", "other"])
    .withMessage("Invalid gender"),
];

const updateRoleValidation = [
  check("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["member", "event_manager", "admin"])
    .withMessage("Invalid role"),
];
/* ---------------- Event Validations ---------------- */
const eventValidation = [
  check("title").notEmpty().withMessage("Title is required").isLength({ min: 3, max: 100 }),
  check("description").optional().isLength({ max: 500 }).withMessage("Description too long"),
  check("startDate").notEmpty().withMessage("Start Date is required").isISO8601().withMessage("Invalid date"),
  check("endDate").notEmpty().withMessage("End Date is required").isISO8601().withMessage("Invalid date"),
  body("endDate").custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startDate)) {
      throw new Error("End Date must be after Start Date");
    }
    return true;
  }),
  check("location.city").notEmpty().withMessage("City is required"),
  // check("location.venue").notEmpty().withMessage("Venue is required"),
  check("category").notEmpty().withMessage("Category is required"),
  check("createdBy").notEmpty().withMessage("CreatedBy is required"),
  check("status").optional().isIn(["active", "blocked"]).withMessage("Invalid status"),
];

const participantValidation = [
  //check("userId").notEmpty().withMessage("User ID is required"),
  check("name").notEmpty().withMessage("Name is required"),
  check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
  check("status").optional().isIn(["applied", "approved", "rejected", "cancelled"]).withMessage("Invalid status"),
];

const paymentValidation = [
  check("method").notEmpty().withMessage("Payment method is required").isIn(["online", "offline"]).withMessage("Invalid payment method"),
  check("proofUrl").optional().isURL().withMessage("Invalid proof URL"),
  check("transactionId").optional().isString().withMessage("Invalid transaction ID"),
];

/* ---------------- Validation Result Handler ---------------- */
const validationRes = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updateRoleValidation,
  eventValidation,
  participantValidation,
  paymentValidation,
  validationRes,
};

const { body, param } = require("express-validator");

const passwordRule = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters.")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter.")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter.")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number.");

const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  passwordRule,

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Mobile number must contain 10 to 15 digits."),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status.")
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];

const idValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user ID.")
];

const updateUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Mobile number must contain 10 to 15 digits."),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status.")
];

const profileUpdateValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Mobile number must contain 10 to 15 digits.")
];

module.exports = {
  createUserValidation,
  loginValidation,
  idValidation,
  updateUserValidation,
  profileUpdateValidation
};

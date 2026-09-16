const { body } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Product name must be between 2 and 100 characters."
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Description cannot exceed 1000 characters."
    ),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage(
      "Stock must be a valid positive integer."
    ),

  body("categoryId")
    .notEmpty()
    .withMessage("Category is required.")
    .isInt()
    .withMessage("Invalid category."),
];

module.exports = productValidation;
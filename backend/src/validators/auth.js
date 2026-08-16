const { body } = require("express-validator");


const registerValidation = [
    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be between 2 and 100 characters"),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be between 2 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .notEmpty()
        .withMessage("Password must be required")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be 8 char long"),

    body("role_id")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
]

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password must be required")
        .isLength({ min: 8, max: 100 })
        .withMessage("Password must be 8 char long"),
]

module.exports = { registerValidation, loginValidation }
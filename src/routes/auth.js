const express = require("express");

const { register, login } = require("../controller/auth");

const { loginValidation, registerValidation } = require("../validators/auth");

const {
    validationHandler
} = require("../middleware/validationHandler");



const router = express.Router();


router.post(
    "/register",
    registerValidation,
    validationHandler,
    register
);


router.post(
    "/login",
    loginValidation,
    validationHandler,
    login
);


module.exports = router;
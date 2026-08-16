const { registerUser, loginUser } = require("../service/auth");
const { successResponse } = require("../utils/responseHandler");



const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body)
        return successResponse(
            res,
            201,
            "User registered successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body)
        return successResponse(
            res,
            200,
            "Login successful",
            {
              
                result
            }
        );

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login
};
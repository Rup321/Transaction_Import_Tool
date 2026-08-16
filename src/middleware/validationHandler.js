const { validationResult } = require("express-validator")

const validationHander = async (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array(),
            success: false,
        })
    }
    next();
}

module.exports = { validationHander }
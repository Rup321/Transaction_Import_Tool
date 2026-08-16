const { validationResult } = require("express-validator")

const validationHander = async (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()
        })
    }
    next();
}

module.exports = { validationHander }
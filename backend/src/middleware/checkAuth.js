const jwt = require("jsonwebtoken");
require("dotenv").config()

const checkAuth = async (req, res, next) => {
    const header = req.headers['authorization'];


    const token = header && header.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied, please provide token"
        })
    }

    try {
        let verify = jwt.verify(token, process.env.SECREAT_KEY)
        req.userData = verify
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Please provide valid token or token is expired" })
    }
}

module.exports = { checkAuth }
const errorHandler = async (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error"
    })
}

module.exports = { errorHandler }
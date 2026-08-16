const errorHandler = async (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal server error",
        success: false,
    })
}

module.exports = { errorHandler }
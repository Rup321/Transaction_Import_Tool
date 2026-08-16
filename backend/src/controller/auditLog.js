
const { getAllAuditLogs } = require("../service/audiLog");
const { successResponse } = require("../utils/responseHandler");

const getAuditLogs = async (req, res, next) => {
    try {

        const result = await getAllAuditLogs();

        return successResponse(
            res,
            200,
            "Audit logs fetched successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuditLogs
};

const { uploadTransactionFile, getBatchDetails, approveBatchService } = require("../service/fileUpload");
const { successResponse } = require("../utils/responseHandler");

const uploadFile = async (req, res, next) => {
    try {

        const result = await uploadTransactionFile(req);

        return successResponse(
            res,
            201,
            "File uploaded successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};
const getBatchById = async (req, res, next) => {
    try {

        const result = await getBatchDetails(req.params.id);

        return successResponse(
            res,
            200,
            "Batch details fetched successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};

const approveBatch = async (req, res, next) => {
    try {

        const result = await approveBatchService(
            req.params.id,
            req
        );

        return successResponse(
            res,
            200,
            "Batch approved successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};


module.exports = {
    uploadFile,
    getBatchById,
    approveBatch
};
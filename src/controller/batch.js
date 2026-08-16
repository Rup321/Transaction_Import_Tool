const { getAllBatches } = require("../service/batch");
const { successResponse } = require("../utils/responseHandler");

const getBatches = async (req, res, next) => {
    try {

        const result = await getAllBatches();

        return successResponse(
            res,
            200,
            "Batches fetched successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBatches
};
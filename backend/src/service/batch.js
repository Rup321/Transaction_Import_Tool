const { Batch, User } = require("../models");

const getAllBatches = async () => {

    const batches = await Batch.findAll({
        attributes: [
            "id",
            "file_name",
            "status",
            "total_records",
            "valid_records",
            "invalid_records",
            "remarks",
            "created_at",
            "updated_at"
        ],

        include: [
            {
                model: User,
                as: "uploader",
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email"
                ]
            }
        ],

        order: [
            ["created_at", "DESC"]
        ]
    });

    return batches;
};

module.exports = {
    getAllBatches
};
const { AuditLog, User, Batch } = require("../models");

const getAllAuditLogs = async () => {

    const auditLogs = await AuditLog.findAll({

        attributes: [
            "id",
            "user_id",
            "batch_id",
            "module",
            "action",
            "description",
            "ip_address",
            "request_method",
            "request_url",
            "created_at"
        ],

        include: [
            {
                model: User,
                attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email"
                ]
            },
            {
                model: Batch,
                as: "batch",
                attributes: [
                    "id",
                    "file_name",
                    "status"
                ]
            }
        ],

        order: [
            ["created_at", "DESC"]
        ]
    });

    return auditLogs;
};

module.exports = {
    getAllAuditLogs
};
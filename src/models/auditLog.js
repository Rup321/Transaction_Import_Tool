const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const AuditLog = sequelize.define(
    "AuditLog",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        batch_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        module: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        action: {
            type: DataTypes.ENUM(
                "UPLOAD",
                "APPROVE",
                "LOGIN",
                "LOGOUT",
                "CREATE",
                "UPDATE",
                "DELETE"
            ),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        ip_address: {
            type: DataTypes.STRING,
        },

        request_method: {
            type: DataTypes.STRING,
        },

        request_url: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "audit_logs",
        underscored: true,
        paranoid: false,
        freezeTableName: true,
    }
);

module.exports = { AuditLog };
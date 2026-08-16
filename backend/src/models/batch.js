const { DataTypes } = require("sequelize");
const {sequelize} = require("../../config/db");

const Batch = sequelize.define(
    "Batch",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        uploaded_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM("PENDING", "AUTHORIZED"),
            defaultValue: "PENDING",
        },

        total_records: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        valid_records: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        invalid_records: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        remarks: DataTypes.TEXT,

    },
    {
        tableName: "batches",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
);

module.exports = {Batch};
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        batch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "batches",
                key: "id"
            }
        },

        transaction_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        customer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        account_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0.01
            }
        },

        status: {
            type: DataTypes.ENUM("PENDING", "AUTHORIZED"),
            defaultValue: "PENDING",
        },

        remarks: DataTypes.TEXT,


    },
    {
        tableName: "transactions",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
);

module.exports = { Transaction };
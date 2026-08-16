const { DataTypes } = require("sequelize");
const {sequelize} = require("../../config/db");

const Role = sequelize.define(
    "Role",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        role_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    },
    {
        tableName: "roles",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
);

module.exports = { Role };
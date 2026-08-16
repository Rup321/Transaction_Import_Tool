const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const RolePermission = sequelize.define("RolePermission", {

},
    {
        tableName: "role_permissions",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
);


module.exports = { RolePermission }
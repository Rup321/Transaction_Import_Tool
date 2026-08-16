const { DataTypes, UUID } = require("sequelize");
const { sequelize } = require("../../config/db");

const Permission = sequelize.define("Permission", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    action: {
        type: DataTypes.ENUM(
            "CREATE",
            "READ",
            "UPDATE",
            "DELETE",
            "APPROVE"
        ),
        allowNull: false,
    },
    base_url: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    route: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(),
        allowNull: true
    },

},
    {
        tableName: "permissions",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
)

module.exports = { Permission }
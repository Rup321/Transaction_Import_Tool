const { DataTypes } = require("sequelize");
const {sequelize} = require("../../config/db");
const bcrypt = require("bcrypt")

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: "users",
        underscored: true,
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
    }
);

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    return user.password;
})

User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10)
    }
})

module.exports = { User };
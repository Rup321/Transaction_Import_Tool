const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false
})

const loadModels = () => {
    require("../src/models");
};

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Db Connected successfully");

        loadModels();
        await sequelize.sync({ alter: true });
        console.log("Db synced successfully");
    }
    catch (err) {
        console.log("DB Connection failed", err.message);
    }
}

module.exports = { sequelize, dbConnection }
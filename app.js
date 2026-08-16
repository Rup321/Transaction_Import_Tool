const express = require("express");
const morgan = require("morgan");
const { dbConnection, sequelize } = require("./config/db");
require("./src/models");
const { errorHandler } = require("./src/middleware/errorHandler");
const authRoutes = require("./src/routes/auth")
const { seedRoles } = require("./src/seeders/roleSeeder");



require("dotenv").config();
const app = express();


app.use(express.json());
app.use(morgan("combined"));

app.use("/api/auth", authRoutes)

let PORT = process.env.PORT || 3000

app.use(errorHandler);
const serverConnect = async () => {
    await dbConnection();
    await seedRoles();
    await sequelize.sync({ alter: true });
    console.log("Db synced successfully");


    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}
serverConnect();

const express = require("express");
const morgan = require("morgan");
const { dbConnection, sequelize } = require("./config/db");
require("./src/models");
const { errorHandler } = require("./src/middleware/errorHandler");
const authRoutes = require("./src/routes/auth")
const fileUploadRoutes = require("./src/routes/fileUpload");
const auditLogRoutes = require("./src/routes/auditLog")
const batchRoutes = require("./src/routes/batch")
const { seedRoles } = require("./src/seeders/roleSeeder");
const { seedPermissions } = require("./src/seeders/permissionSeeder");
const { seedRolePermissions } = require("./src/seeders/rolePermissionSeeder");



require("dotenv").config();
const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRoutes)
app.use("/api", fileUploadRoutes)
app.use("/api", batchRoutes)
app.use("/api", auditLogRoutes)

let PORT = process.env.PORT || 3000

app.use(errorHandler);
const serverConnect = async () => {
    await dbConnection();
    await seedRoles();
    seedPermissions();
    seedRolePermissions();
    await sequelize.sync({ alter: true });
    console.log("Db synced successfully");


    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}
serverConnect();

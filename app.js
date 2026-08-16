const express = require("express");
const morgan = require("morgan");
const { dbConnection } = require("./config/db");
const { errorHandler } = require("./src/middleware/errorHandler");

require("dotenv").config();
const app = express();


app.use(express.json());
app.use(morgan("combined"));

let PORT = process.env.PORT || 3000

app.use(errorHandler);
const serverConnect = async () => {
    await dbConnection();
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}
serverConnect();

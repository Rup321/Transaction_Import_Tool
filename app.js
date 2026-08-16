const express = require("express");
const morgan = require("morgan");
const { dbConnection } = require("./config/db");
const app = express();
require("dotenv").config();



app.use(express.json());
app.use(morgan("dev"));

let PORT = process.env.PORT || 3000
dbConnection();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
const express = require("express");

const { checkAuth } = require("../middleware/checkAuth");
const { checkPermission } = require("../middleware/checkPermission");
const { getBatches } = require("../controller/batch");

const router = express.Router();

router.get(
    "/batches",
    checkAuth,
    checkPermission,
    getBatches
);

module.exports = router;
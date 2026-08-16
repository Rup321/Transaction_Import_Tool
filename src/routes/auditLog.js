const express = require("express");

const { checkAuth } = require("../middleware/checkAuth");
const { checkPermission } = require("../middleware/checkPermission");

const { getAuditLogs } = require("../controller/auditLog");

const router = express.Router();

router.get(
    "/audit-logs",
    checkAuth,
    checkPermission,
    getAuditLogs
);

module.exports = router;
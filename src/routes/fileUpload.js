const express = require("express");
const { checkAuth } = require("../middleware/checkAuth");
const { checkPermission } = require("../middleware/checkPermission");
const { upload } = require("../middleware/fileUpload");
const { uploadFile, getBatchById, approveBatch } = require("../controller/fileUpload");
const router = express.Router()


router.post("/upload", checkAuth, checkPermission, upload.single("file"),
    uploadFile
)

router.get(
    "/batches/:id",
    checkAuth,
    checkPermission,
    getBatchById
);


router.put(
    "/batches/:id/approve",
    checkAuth,
    checkPermission,
    approveBatch
);


module.exports = router

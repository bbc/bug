const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const deviceRevert = require("@services/device-revert");
const asyncHandler = require("express-async-handler");

router.get(
    "/save",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await deviceSave(),
        });
    })
);

router.get(
    "/revert",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await deviceRevert(),
        });
    })
);

module.exports = router;
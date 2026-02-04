const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const deviceStackCount = require("@services/device-stackcount");
const asyncHandler = require("express-async-handler");

router.get("/save", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await deviceSave(),
    });
}));

router.get(
    "/stackcount",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await deviceStackCount(),
        });
    })
);

module.exports = router;

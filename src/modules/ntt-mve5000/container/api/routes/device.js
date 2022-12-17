const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const deviceRevert = require("@services/device-revert");

router.get("/save", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceSave(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to save device config",
        });
    }
});

router.get("/revert", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceRevert(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to revert device config",
        });
    }
});

module.exports = router;

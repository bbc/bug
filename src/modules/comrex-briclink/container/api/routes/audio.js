const express = require("express");
const router = express.Router();
const audioHistory = require("@services/audio-history");
const audioList = require("@services/audio-list");

router.get("/", async function (req, res, next) {
    try {
        const result = await audioList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to retrieve audio levels",
        });
    }
});

router.get("/history", async function (req, res, next) {
    try {
        const result = await audioHistory();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to retrieve audio history",
        });
    }
});

module.exports = router;

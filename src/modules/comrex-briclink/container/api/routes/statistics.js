const express = require("express");
const router = express.Router();
const statisticsHistory = require("@services/statistics-history");
const statisticsList = require("@services/statistics-list");

router.get("/", async function (req, res, next) {
    try {
        const result = await statisticsList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to connect peer",
        });
    }
});

router.get("/history", async function (req, res, next) {
    try {
        const result = await statisticsHistory();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to connect peer",
        });
    }
});

module.exports = router;

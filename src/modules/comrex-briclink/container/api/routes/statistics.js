const express = require("express");
const router = express.Router();
const statisticsHistory = require("@services/statistics-history");
const statisticsList = require("@services/statistics-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await statisticsList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/history",
    asyncHandler(async (req, res) => {
        const result = await statisticsHistory();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;

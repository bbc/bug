const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");

const getDownloadStats = require("@services/download-stats");

route.get(
    "/stats",
    asyncHandler(async (req, res) => {
        const results = await getDownloadStats();
        res.json({
            status: "success",
            data: results,
        });
    })
);

module.exports = route;

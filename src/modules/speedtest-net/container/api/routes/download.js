const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

const getDownloadStats = require("@services/download-stats");

route.get(
    "/stats",
    asyncHandler(async (req, res) => {
        const results = await getDownloadStats();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

module.exports = route;

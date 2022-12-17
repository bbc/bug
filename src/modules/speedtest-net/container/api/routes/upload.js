const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

const getUploadStats = require("@services/upload-stats");

route.get(
    "/stats",
    asyncHandler(async (req, res) => {
        const results = await getUploadStats();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

module.exports = route;

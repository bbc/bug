const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");

const getUploadStats = require("@services/upload-stats");

route.get(
    "/stats",
    asyncHandler(async (req, res) => {
        const results = await getUploadStats();
        res.json({
            status: "success",
            data: results,
        });
    })
);

module.exports = route;

const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const networkHistory = require("@services/network-history");

route.get(
    "/:deviceId/history/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await networkHistory(req.params?.deviceId, parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = route;

const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const getSnrHistory = require("@services/receiver-snr-history");
const getPowerHistory = require("@services/receiver-power-history");
const getReceiverStatus = require("@services/receiver-status");

route.get(
    "/snr/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await getSnrHistory(parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.get(
    "/power/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await getPowerHistory(parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.get(
    "/status",
    asyncHandler(async (req, res) => {
        const result = await getReceiverStatus();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = route;

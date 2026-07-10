const express = require("express");
const deviceRoute = require("@services/device-route");
const asyncHandler = require("express-async-handler");
const route = express.Router();

route.get(
    "/:destinationDevice/:destinationIndex/:sourceDevice/:sourceIndex",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await deviceRoute(req.params?.destinationDevice, parseInt(req.params?.destinationIndex), req.params?.sourceDevice, parseInt(req.params?.sourceIndex)),
        });
    })
);

module.exports = route;

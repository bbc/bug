const express = require("express");
const deviceRoute = require("@services/device-route");
const route = express.Router();

route.get("/:destinationDevice/:destinationIndex/:sourceDevice/:sourceIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceRoute(req.params?.destinationDevice, parseInt(req.params?.destinationIndex), req.params?.sourceDevice, parseInt(req.params?.sourceIndex)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to route",
        });
    }
});

module.exports = route;

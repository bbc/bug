const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const rebootDevice = require("@services/device-reboot");
const getDeviceConfig = require("@services/device-config-get");
const deviceHistory = require("@services/device-history");
const setDeviceName = require("@services/device-name-set");

route.all("/reboot", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await rebootDevice(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot the device",
        });
    }
});

route.get("/config", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDeviceConfig(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to retrieve device config",
        });
    }
});

route.get(
    "/history/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await deviceHistory(parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.put("/rename", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await setDeviceName(req.body.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set device name",
        });
    }
});

module.exports = route;

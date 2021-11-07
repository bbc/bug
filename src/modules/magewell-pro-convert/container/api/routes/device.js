const express = require("express");
const route = express.Router();

const rebootDevice = require("@services/device-reboot");
const getDeviceConfig = require("@services/device-config-get");

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

module.exports = route;

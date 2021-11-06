const express = require("express");
const route = express.Router();

const rebootDevice = require("@services/device-reboot");

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

module.exports = route;

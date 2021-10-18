const express = require("express");
const route = express.Router();

const getDeviceList = require("@services/device-list");

route.get("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDeviceList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch device list",
        });
    }
});


module.exports = route;

const express = require("express");
const route = express.Router();

const { start, stop } = require("@services/test-start");

route.get("/start", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await start(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to start speedtest",
        });
    }
});

route.get("/stop", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await stop(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to stop speedtest",
        });
    }
});

module.exports = route;

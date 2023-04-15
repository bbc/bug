const express = require("express");
const ddmLock = require("@services/ddm-lock");
const ddmUnlock = require("@services/ddm-unlock");
const route = express.Router();

route.get("/lock/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmLock(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to lock",
        });
    }
});

route.get("/unlock/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmUnlock(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unlock",
        });
    }
});

module.exports = route;

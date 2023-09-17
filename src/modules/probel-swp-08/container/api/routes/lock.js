const express = require("express");
const matrixLock = require("@services/matrix-lock");
const matrixUnlock = require("@services/matrix-unlock");
const matrixForceUnlock = require("@services/matrix-forceunlock");
const route = express.Router();

route.get("/lock/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixLock(req.params?.index),
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
            data: await matrixUnlock(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unlock",
        });
    }
});

route.get("/forceunlock/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixForceUnlock(req.params?.index),
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

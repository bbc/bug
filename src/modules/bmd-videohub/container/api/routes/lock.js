const express = require("express");
const videohubLock = require("@services/videohub-lock");
const videohubUnlock = require("@services/videohub-unlock");
const videohubForceUnlock = require("@services/videohub-forceunlock");
const route = express.Router();

route.get("/lock/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubLock(req.params?.index),
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
            data: await videohubUnlock(req.params?.index),
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
            data: await videohubForceUnlock(req.params?.index),
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

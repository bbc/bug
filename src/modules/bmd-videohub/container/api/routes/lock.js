const express = require("express");
const videohubLock = require("@services/videohub-lock");
const videohubUnlock = require("@services/videohub-unlock");
const videohubForceUnlock = require("@services/videohub-forceunlock");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/lock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubLock(req.params?.index),
    });
}));

route.get("/unlock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubUnlock(req.params?.index),
    });
}));

route.get("/forceunlock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubForceUnlock(req.params?.index),
    });
}));

module.exports = route;

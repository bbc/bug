const express = require("express");
const videohubGetDestinations = require("@services/videohub-getdestinations");
const videohubGetAllDestinations = require("@services/videohub-getalldestinations");
const videohubLock = require("@services/videohub-lock");
const videohubUnlock = require("@services/videohub-unlock");
const videohubForceUnlock = require("@services/videohub-forceunlock");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetAllDestinations(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

route.post("/seticon/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonSetIcon("destination", req.params?.index, req.body?.icon, req.body?.color),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.get("/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetDestinations(req.params?.groupIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

route.post("/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetDestinations(req.params?.groupIndex, req.body.showExcluded ? true : false),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

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
            message: "Failed to lock destination",
        });
    }
});

route.get("/unlock/:index", async function (req, res, next) {
    try {
        console.log("SSSS");
        res.json({
            status: "success",
            data: await videohubUnlock(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unlock destination",
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
            message: "Failed to force unlock destination",
        });
    }
});

route.delete("/:groupIndex/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonRemove("destination", req.params?.groupIndex, req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove button",
        });
    }
});

module.exports = route;

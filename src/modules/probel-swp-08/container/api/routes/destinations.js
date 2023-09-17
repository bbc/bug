const express = require("express");
const matrixGetDestinations = require("@services/matrix-getdestinations");
const matrixGetAllDestinations = require("@services/matrix-getalldestinations");
const matrixLock = require("@services/matrix-lock");
const matrixUnlock = require("@services/matrix-unlock");
const matrixForceUnlock = require("@services/matrix-forceunlock");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixGetAllDestinations(),
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
            data: await matrixGetDestinations(req.params?.groupIndex),
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
            data: await matrixGetDestinations(req.params?.groupIndex, req.body.showExcluded ? true : false),
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
            data: await matrixLock(req.params?.index),
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
        res.json({
            status: "success",
            data: await matrixUnlock(req.params?.index),
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
            data: await matrixForceUnlock(req.params?.index),
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

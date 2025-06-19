const express = require("express");
const destinationList = require("@services/destination-list");
const destinationRename = require("@services/destination-rename");
const destinationSetDescription = require("@services/destination-setdescription");
const destinationListAll = require("@services/destination-listall");
const destinationGroupList = require("@services/destinationgroup-list");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const matrixLock = require("@services/matrix-lock");
const matrixUnlock = require("@services/matrix-unlock");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationListAll(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

route.get("/groups", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationGroupList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destination groups",
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
            message: "Failed to get destinations",
        });
    }
});

route.get("/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationList(req.params?.groupIndex),
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
            data: await destinationList(req.params?.groupIndex, req.body.showExcluded ? true : false),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

route.get("/setname/:buttonIndex/:label?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationRename(parseInt(req.params?.buttonIndex), req.params?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

route.get("/setdescription/:buttonIndex/:description?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationSetDescription(parseInt(req.params?.buttonIndex), req.params?.description),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set description",
        });
    }
});

route.delete("/:groupId/:name", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonRemove("destination", parseInt(req.params?.groupId), req.params?.name),
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

const express = require("express");
const videohubGetDestinations = require("@services/videohub-getdestinations");
const videohubGetAllDestinations = require("@services/videohub-getalldestinations");
const videohubLock = require("@services/videohub-lock");
const videohubUnlock = require("@services/videohub-unlock");
const videohubForceUnlock = require("@services/videohub-forceunlock");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetAllDestinations(),
    });
}));

route.post("/seticon/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonSetIcon("destination", parseInt(req.params?.index), req.body?.icon, req.body?.color),
    });
}));

route.get("/:groupIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetDestinations(parseInt(req.params?.groupIndex)),
    });
}));

route.post("/:groupIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetDestinations(parseInt(req.params?.groupIndex), req.body.showExcluded ? true : false),
    });
}));

route.get("/lock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubLock(parseInt(req.params?.index)),
    });
}));

route.get("/unlock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubUnlock(parseInt(req.params?.index)),
    });
}));

route.get("/forceunlock/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubForceUnlock(parseInt(req.params?.index)),
    });
}));

route.delete("/:groupIndex/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonRemove("destination", parseInt(req.params?.groupIndex), parseInt(req.params?.index)),
    });
}));

module.exports = route;

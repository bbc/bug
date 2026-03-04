const express = require("express");
const router = express.Router();
const entryList = require("@services/entry-list");
const entrySetRoute = require("@services/entry-setroute");
const entryDelete = require("@services/entry-delete");
const entryLock = require("@services/entry-lock");
const entryAdd = require("@services/entry-add");
const entryUnlock = require("@services/entry-unlock");
const entrySetLabel = require("@services/entry-setlabel");
const entrySetGroup = require("@services/entry-setgroup");
const entryClearConnections = require("@services/entry-clearconnections");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryList(),
    });
}));

router.post("/add", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryAdd(req.body)
    });
}));

router.put("/route", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entrySetRoute(req.body?.address, req.body?.list),
    });
}));

router.delete("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryDelete(req.body?.address),
    });
}));

router.put("/lock", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryLock(req.body.address),
    });
}));

router.put("/unlock", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryUnlock(req.body.address),
    });
}));

router.put("/setlabel", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entrySetLabel(req.body.address, req.body.label),
    });
}));

router.put("/setgroup", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entrySetGroup(req.body.address, req.body.group),
    });
}));

router.put("/clear", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryClearConnections(req.body.address),
    });
}));

module.exports = router;

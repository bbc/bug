const express = require("express");
const router = express.Router();
const entryList = require("@services/entry-list");
const entrySetRoute = require("@services/entry-setroute");
const entryRemoveRoute = require("@services/entry-removeroute");
const entryLock = require("@services/entry-lock");
const entryUnlock = require("@services/entry-unlock");
const entrySetLabel = require("@services/entry-setlabel");
const entrySetGroup = require("@services/entry-setgroup");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryList(),
    });
}));

router.put("/route", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entrySetRoute(req.body?.address, req.body?.list),
    });
}));

router.delete("/route", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryRemoveRoute(req.body?.address),
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

module.exports = router;

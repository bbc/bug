const express = require("express");
const router = express.Router();
const entryList = require("@services/entry-list");
const entrySetRoute = require("@services/entry-setroute");
const entryRemoveRoute = require("@services/entry-removeroute");
const entryLock = require("@services/entry-lock");
const entryUnlock = require("@services/entry-unlock");
const entrySetLabel = require("@services/entry-setlabel");
const entrySetGroup = require("@services/entry-setgroup");

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entryList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to list sdwan entries",
        });
    }
});

router.put("/route", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entrySetRoute(req.body?.address, req.body?.list),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to update sdwan entry",
        });
    }
});

router.delete("/route", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entryRemoveRoute(req.body?.address),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove sdwan entry",
        });
    }
});

router.put("/lock", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entryLock(req.body.address),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to lock sdwan entry",
        });
    }
});

router.put("/unlock", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entryUnlock(req.body.address),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unlock sdwan entry",
        });
    }
});

router.put("/setlabel", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entrySetLabel(req.body.address, req.body.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label for sdwan entry",
        });
    }
});

router.put("/setgroup", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await entrySetGroup(req.body.address, req.body.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set group for sdwan entry",
        });
    }
});

module.exports = router;

const express = require("express");
const route = express.Router();

const getDeviceList = require("@services/device-list");
const rebootDevice = require("@services/device-reboot");
const locateDevice = require("@services/device-locate");
const renameDevice = require("@services/device-rename");

route.all("/list", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDeviceList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch Unifi Controller devices",
        });
    }
});

route.get("/reboot/:deviceId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await rebootDevice(req.params?.deviceId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot device",
        });
    }
});

route.get("/locate/:deviceId/enable", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await locateDevice(req.params?.deviceId, true),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to locate device",
        });
    }
});

route.get("/locate/:deviceId/disable", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await locateDevice(req.params?.deviceId, false),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to locate device",
        });
    }
});

route.post("/rename/:deviceId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await renameDevice(req.params?.deviceId, req.body.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename device",
        });
    }
});

module.exports = route;

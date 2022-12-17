const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const rebootDevice = require("@services/device-reboot");
const renameDevice = require("@services/device-rename");
const sourceName = require("@services/source-name");
const sourceDiscovery = require("@services/source-discovery");
const sourceGroup = require("@services/source-group");
const deleteDevice = require("@services/device-delete");
const addDevice = require("@services/device-add");
const editDevice = require("@services/device-edit");
const listDevice = require("@services/device-list");
const getDevice = require("@services/device-get");
const getDeviceConfig = require("@services/device-config-get");
const deviceHistory = require("@services/device-history");

route.post("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await addDevice(req.body),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add the encoder",
        });
    }
});

route.put("/:deviceId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await editDevice(req.params.deviceId, req.body),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to edit the encoder",
        });
    }
});

route.post("/list", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await listDevice(),
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to get list of encoders",
        });
    }
});

route.post("/:deviceId/reboot", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await rebootDevice(req.params?.deviceId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot the device",
        });
    }
});

route.post("/:deviceId/delete", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deleteDevice(req.params?.deviceId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete the device",
        });
    }
});

route.put("/:deviceId/rename", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await renameDevice(req.params?.deviceId, req.body?.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename the device",
        });
    }
});

route.put("/:deviceId/sourcename", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await sourceName(req.params?.deviceId, req.body?.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set NDI source name for the device",
        });
    }
});

route.put("/:deviceId/discovery", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await sourceDiscovery(req.params?.deviceId, req.body?.address),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set NDI discovery server for the device",
        });
    }
});

route.put("/:deviceId/group", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await sourceGroup(req.params?.deviceId, req.body?.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set NDI group for the device",
        });
    }
});

route.get("/:deviceId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDevice(req.params.deviceId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder data",
        });
    }
});

route.get("/config", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDeviceConfig(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to retrieve device config",
        });
    }
});

route.get(
    "/:deviceId/history/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await deviceHistory(req.params.deviceId, parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = route;

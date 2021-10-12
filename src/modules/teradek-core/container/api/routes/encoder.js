const express = require("express");
const route = express.Router();

const deviceGet = require("@services/device-get");
const devicePair = require("@services/device-pair");
const deviceReboot = require("@services/device-reboot");
const deviceRename = require("@services/device-rename");
const deviceUnpair = require("@services/device-unpair");
const encoderStart = require("@services/encoder-start");
const encoderRestart = require("@services/encoder-restart");
const encoderStop = require("@services/encoder-stop");
const getEncoderList = require("@services/encoder-list");
const getSelectedEncoders = require("@services/encoder-getselected");
const deviceRemove = require("@services/device-remove");

route.delete("/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceRemove("encoders", req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove encoder",
        });
    }
});

route.get("/stop/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await encoderStop(req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to stop selected encoder",
        });
    }
});

route.get("/start/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await encoderStart(req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to start selected encoder",
        });
    }
});

route.get("/restart/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await encoderRestart(req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to restart video on selected encoder",
        });
    }
});

route.get("/reboot/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceReboot(req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot device",
        });
    }
});

route.get("/pair/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await devicePair(req?.params?.sid, req?.body?.decoderSid)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to pair selected encoder",
        });
    }
});

route.get("/unpair/:encoderId/:decoderId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceUnpair(req?.params?.encoderId, req?.params?.decoderId)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unpair selected encoder",
        });
    }
});

route.get("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getEncoderList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch encoder list",
        });
    }
});

route.all("/selected/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await getSelectedEncoders(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch selected encoders",
        });
    }
});

route.get("/rename/:sid/:name", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceRename(req?.params?.sid, req.params?.name)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename encoder",
        });
    }
});

route.get("/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceGet(req?.params?.sid)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder",
        });
    }
});

module.exports = route;

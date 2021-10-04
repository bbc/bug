const express = require("express");
const route = express.Router();

const deviceGet = require("@services/device-get");
const devicePair = require("@services/device-pair");
const deviceRename = require("@services/device-rename");
const deviceUnpair = require("@services/device-unpair");
const encoderStart = require("@services/encoder-start");
const encoderStop = require("@services/encoder-stop");
const getEncoderList = require("@services/encoder-list");
const getSelectedEncoders = require("@services/encoder-getselected");

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
            message: "Failed to fetch stop selected encoder",
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
            message: "Failed to fetch start selected encoder",
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
            message: "Failed to fetch pair selected encoder",
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
            message: "Failed to fetch unpair selected encoder",
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
            data: await deviceRename(req?.params?.sid, req.body?.name)
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

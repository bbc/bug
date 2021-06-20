//NAME: device.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: Devices endpoint

const express = require("express");
const device = express.Router();

const hashResponse = require("@core/hash-response");
const getEncoderDevices = require("@services/devices-encoder-get");
const getDecoderDevices = require("@services/devices-decoder-get");
const getDevices = require("@services/devices-get");
const getDevice = require("@services/device-get");
const renameDevice = require("@services/device-rename");
const encoderStart = require("@services/encoder-start");
const encoderStop = require("@services/encoder-stop");
const pairDevice = require("@services/device-pair");
const unpairDevice = require("@services/device-unpair");

device.get("/stop/:sid", async function (req, res) {
    hashResponse(res, req, await encoderStop(req?.params?.sid));
});

device.get("/start/:sid", async function (req, res) {
    hashResponse(res, req, await encoderStart(req?.params?.sid));
});

device.put("/pair/:sid", async function (req, res) {
    hashResponse(
        res,
        req,
        await pairDevice(req?.params?.sid, req?.body?.decoderSid)
    );
});

device.put("/unpair/:sid", async function (req, res) {
    hashResponse(
        res,
        req,
        await unpairDevice(req?.params?.sid, req?.body?.decoderSid)
    );
});

device.get("/all/encoders", async function (req, res) {
    hashResponse(res, req, await getEncoderDevices());
});

device.get("/all/decoders", async function (req, res) {
    hashResponse(res, req, await getDecoderDevices());
});

device.get("/all", async function (req, res) {
    hashResponse(res, req, await getDevices());
});

device.put("/rename/:sid", async function (req, res) {
    hashResponse(
        res,
        req,
        await renameDevice(req?.params?.sid, req.body?.name)
    );
});

device.get("/:sid", async function (req, res) {
    hashResponse(res, req, await getDevice(req?.params?.sid));
});

module.exports = device;

//NAME: device.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const express = require("express");
const output = express.Router();

const hashResponse = require("@core/hash-response");
const getEncoderDevices = require("@services/devices-encoder-get");
const getDecoderDevices = require("@services/devices-decoder-get");
const getDevice = require("@services/device-get");

output.get("/all/encoders", async function (req, res) {
    hashResponse(res, req, await getEncoderDevices());
});

output.get("/all/decoders", async function (req, res) {
    hashResponse(res, req, await getDecoderDevices());
});

output.get("/:sid", async function (req, res) {
    hashResponse(res, req, await getDevice(req?.params?.sid));
});

module.exports = output;

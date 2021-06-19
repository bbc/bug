//NAME: link.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: link endpoint

const express = require("express");
const link = express.Router();

const hashResponse = require("@core/hash-response");
const getDevice = require("@services/link-get");
const getDevices = require("@services/links-get");

link.get("/all", async function (req, res) {
    hashResponse(res, req, await getDevices());
});

link.get("/:sid", async function (req, res) {
    hashResponse(res, req, await getDevice(req?.params?.sid));
});

module.exports = link;

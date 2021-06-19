//NAME: pair.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: link endpoint

const express = require("express");
const pair = express.Router();

const hashResponse = require("@core/hash-response");
const pairDevices = require("@services/pair-devices");

pair.put("/:sid", async function (req, res) {
    hashResponse(res, req, await pairDevices(req?.params?.sid));
});

module.exports = pair;

//NAME: channel.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: Channel endpoint

const express = require("express");
const channel = express.Router();

const hashResponse = require("@core/hash-response");
const getChannels = require("@services/channels-get");
const getChannel = require("@services/channel-get");

channel.get("/all", async function (req, res) {
    hashResponse(res, req, await getChannels());
});

channel.get("/:identifier", async function (req, res) {
    hashResponse(res, req, await getChannel(req?.params?.identifier));
});

module.exports = channel;

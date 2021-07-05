//NAME: output.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const express = require("express");
const output = express.Router();

const hashResponse = require("@core/hash-response");
const getSystemAll = require("@services/system-get-all");
const getSystemLatest = require("@services/system-get-latest");

output.get("/", async function (req, res) {
    hashResponse(res, req, await getSystemAll());
});

output.get("/latest", async function (req, res) {
    hashResponse(res, req, await getSystemLatest());
});

module.exports = output;

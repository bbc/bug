//NAME: output.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const express = require("express");
const output = express.Router();

const hashResponse = require("@core/hash-response");
const getSystem = require("@services/system-get");

output.get("/", async function (req, res) {
    hashResponse(res, req, await getSystem());
});

module.exports = output;

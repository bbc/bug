//NAME: output.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const express = require("express");
const output = express.Router();

const hashResponse = require("@core/hash-response");
const getOutputs = require("@services/outputs-get");
const getOutput = require("@services/output-get");
const setOutput = require("@services/output-set");
const setOutputState = require("@services/output-state-set");
const setOutputName = require("@services/output-name-set");
const setOutputDelay = require("@services/output-delay-set");

output.get("/all", async function (req, res) {
    hashResponse(res, req, {
        data: await getOutputs(),
    });
});

output.get("/:output_number", async function (req, res) {
    hashResponse(res, req, await getOutput(req?.params?.output_number));
});

output.post("/:output_number/state", async function (req, res) {
    const response = await setOutputState(
        req?.params?.output_number,
        req.body.state
    );
    hashResponse(res, req, response);
});

output.post("/:output_number/name", async function (req, res) {
    const response = await setOutputName(
        req?.params?.output_number,
        req.body.name
    );
    hashResponse(res, req, response);
});

output.post("/:output_number/delay", async function (req, res) {
    const response = await setOutputDelay(
        req?.params?.output_number,
        req.body.delay
    );
    hashResponse(res, req, response);
});

output.post("/:output_number", async function (req, res) {
    const status = await setOutput(req?.params?.output_number);

    hashResponse(res, req, {
        output: status,
    });
});

module.exports = output;

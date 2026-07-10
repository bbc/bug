"use strict";
const validationResult = require("@core/ValidationResult");
const ping = require("ping");
const isValidAddress = require("@core/isValidAddress");
const turtleWebApi = require("@utils/turtle-webapi");

module.exports = async (formData) => {
    if (!isValidAddress(formData["address"])) {
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Address is not valid",
            },
        ]);
    }

    const pingResult = await ping.promise.probe(formData["address"]);
    if (!pingResult.alive) {
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Device is not reachable",
            },
        ]);
    }

    // now check api
    try {
        const response = await turtleWebApi.get("cgi-bin/getjson.cgi?json=dante", { address: formData["address"] });
        if (!Array.isArray(response?.dante)) {
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Device is reachable but API returned an unexpected response",
                },
            ]);
        }
    } catch (error) {
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Device is reachable but API is not responding",
            },
        ]);
    }
    return new validationResult([
        {
            state: true,
            field: "address",
            message: "Device is reachable and API is responding",
        },
    ]);
};

"use strict";
const validationResult = require("@core/ValidationResult");
const ping = require("ping");
const isValidAddress = require("@core/isValidAddress");

module.exports = async (formData) => {
    try {
        if (!isValidAddress(formData["address"])) {
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Address is not valid",
                },
            ]);
        }

        let res = await ping.promise.probe(formData["address"]);
        if (res.alive) {
            return new validationResult([
                {
                    state: true,
                    field: "address",
                    message: "MDU is reachable",
                },
            ]);
        }
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "MDU is not reachable",
            },
        ]);
    } catch (error) {
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Address is not valid",
            },
        ]);
    }
};

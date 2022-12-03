"use strict";
const validationResult = require("@core/ValidationResult");
const ping = require("ping");

module.exports = async (formData) => {
    try {
        let res = await ping.promise.probe(formData["address"]);
        if (res.alive) {
            return new validationResult([
                {
                    state: true,
                    field: "address",
                    message: "Address is reachable",
                },
            ]);
        } else {
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Address is not reachable",
                },
            ]);
        }
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

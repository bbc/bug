"use strict";
const validationResult = require("@core/ValidationResult");
const ping = require("ping");

module.exports = async (formData) => {
    try {
        let res = await ping.promise.probe(formData["address"]);
        console.log(res);
        if (res.alive) {
            return new validationResult([
                {
                    state: true,
                    field: "address",
                    message: "Device is reachable and connecting OK",
                },
            ]);
        } else {
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Device is not reachable",
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

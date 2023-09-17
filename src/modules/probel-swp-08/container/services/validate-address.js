"use strict";
const validationResult = require("@core/ValidationResult");
const ping = require("ping");
const matrixTest = require("@services/matrix-test");

module.exports = async (formData) => {
    try {
        let res = await ping.promise.probe(formData["address"]);
        if (res.alive) {
            if (await matrixTest(formData.address, formData.port)) {
                return new validationResult([
                    {
                        state: true,
                        field: "address",
                        message: "Device is reachable and connecting OK",
                    },
                ]);
            }
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Device reachable, but cannot connect to Probel SWP08 socket",
                },
            ]);
        }
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Device is not reachable",
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

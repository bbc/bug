"use strict";
const validationResult = require("@core/ValidationResult");
const prodigyTest = require("@services/prodigy-test");

module.exports = async (formData) => {
    if (await prodigyTest(formData.address, formData.port)) {
        return new validationResult([
            {
                state: true,
                field: "port",
                message: "Device is reachable and connecting OK",
            },
        ]);
    }
    return new validationResult([
        {
            state: false,
            field: "port",
            message: "Device reachable, but cannot connect to socket API",
        },
    ]);
};

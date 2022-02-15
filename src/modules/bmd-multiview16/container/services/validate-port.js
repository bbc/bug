"use strict";
const validationResult = require("@core/ValidationResult");
const videohubTest = require("@services/videohub-test");

module.exports = async (formData) => {
    if (await videohubTest(formData.address, formData.port)) {
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
            message: "Device reachable, but cannot connect to BMD API",
        },
    ]);
};

"use strict";
const validationResult = require("@core/ValidationResult");
const matrixTestProbel = require("@services/matrix-testprobel");

module.exports = async (formData) => {
    if (await matrixTestProbel(formData.address, formData.port)) {
        return new validationResult([
            {
                state: true,
                field: "port",
                message: "Connected OK",
            },
        ]);
    }
    return new validationResult([
        {
            state: false,
            field: "port",
            message: "Failed to connect",
        },
    ]);
};

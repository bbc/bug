"use strict";
const validationResult = require("@core/ValidationResult");
const matrixTestUi = require("@services/matrix-testui");

module.exports = async (formData) => {
    if (await matrixTestUi(formData.address, formData.uiPort)) {
        return new validationResult([
            {
                state: true,
                field: "uiPort",
                message: "Connected OK",
            },
        ]);
    }
    return new validationResult([
        {
            state: false,
            field: "uiPort",
            message: "Failed to connect",
        },
    ]);
};

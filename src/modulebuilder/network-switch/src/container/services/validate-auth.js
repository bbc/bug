"use strict";
const validationResult = require("@core/ValidationResult");

module.exports = async (formData) => {
    try {
        // use your device API to fetch a simple string/variable and put it in 'result'
        // if (result && result.modelName) {
        //     return new validationResult([
        //         {
        //             state: true,
        //             field: "username",
        //             message: "Logged into device OK",
        //         },
        //         {
        //             state: true,
        //             field: "password",
        //             message: "Logged into device OK",
        //         },
        //     ]);
        // }
    } catch (error) {
        // do nothing
    }

    return new validationResult([
        {
            state: false,
            field: "username",
            message: "Could not log into device",
        },
        {
            state: false,
            field: "password",
            message: "Could not log into device",
        },
    ]);
};

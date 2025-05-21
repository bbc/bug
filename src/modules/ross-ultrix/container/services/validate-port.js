"use strict";
const validationResult = require("@core/ValidationResult");
const matrixTest = require("@services/matrix-test");

module.exports = async (formData) => {
    // if (await matrixTest(formData.address, formData.port)) {
    //     return new validationResult([
    //         {
    //             state: true,
    //             field: "port",
    //             message: "Device is reachable and connecting OK",
    //         },
    //     ]);
    // }
    // return new validationResult([
    //     {
    //         state: false,
    //         field: "port",
    //         message: "Device reachable, but cannot connect to Probel SWP08 socket",
    //     },
    // ]);
};

"use strict";
const validationResult = require("@core/ValidationResult");
// const ciscoSGSSH = require("@utils/ciscosg-ssh");

module.exports = async (formData) => {
    // try {
    //     const result = await ciscoSGSSH({
    //         host: formData.address,
    //         username: formData.username,
    //         password: formData.password,
    //         timeout: 20000,
    //         commands: ["show version"],
    //     });
    //     if (result && result.length > 0 && result[0].toLowerCase().indexOf("version") > -1) {
    //         return new validationResult([
    //             {
    //                 state: true,
    //                 field: "username",
    //                 message: "Logged into device OK",
    //             },
    //             {
    //                 state: true,
    //                 field: "password",
    //                 message: "Logged into device OK",
    //             },
    //         ]);
    //     }
    // } catch (error) {
    //     // do nothing
    // }
    // return new validationResult([
    //     {
    //         state: false,
    //         field: "username",
    //         message: "Could not log into device",
    //     },
    //     {
    //         state: false,
    //         field: "password",
    //         message: "Could not log into device",
    //     },
    // ]);
};

"use strict";
const validationResult = require("@core/ValidationResult");
const aristaApi = require("@utils/arista-api");

module.exports = async (formData) => {
    // try {
    const result = await aristaApi({
        host: formData.address,
        protocol: "https",
        port: 443,
        username: formData.username,
        password: formData.password,
        commands: ["show version"],
    });

    console.log(result);
    if (result && result.modelName) {
        return new validationResult([
            {
                state: true,
                field: "username",
                message: "Logged into device OK",
            },
            {
                state: true,
                field: "password",
                message: "Logged into device OK",
            },
        ]);
    }
    // } catch (error) {
    //     // do nothing
    // }
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

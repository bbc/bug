"use strict";
const validationResult = require("@core/ValidationResult");
const basicAuth = require("@utils/basic-auth");

module.exports = async (formData) => {
    try {
        const result = await basicAuth({
            host: formData.address,
            username: formData.username,
            password: formData.password,
            timeout: 3000,
        });

        if (result.status == 200) {
            return new validationResult([
                {
                    state: true,
                    field: "username",
                    message: "Logged into MDU",
                },
                {
                    state: true,
                    field: "password",
                    message: "Logged into MDU",
                },
            ]);
        }
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

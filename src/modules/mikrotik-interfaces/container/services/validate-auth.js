"use strict";
const validationResult = require("@core/ValidationResult");
const RouterOSApi = require("@core/routeros-api");

module.exports = async (formData) => {
    try {
        const routerOsApi = new RouterOSApi({
            host: formData.address,
            user: formData.username,
            password: formData.password,
            timeout: 5,
        });

        await routerOsApi.connect();
    } catch (error) {
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
    }

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
};

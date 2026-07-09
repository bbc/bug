"use strict";
const validationResult = require("@core/ValidationResult");
const RouterOSApi = require("@core/routeros-api");

module.exports = async (formData) => {
    let routerOsApi;

    try {
        routerOsApi = new RouterOSApi({
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
    } finally {
        if (routerOsApi) {
            try {
                await routerOsApi.disconnect();
            } catch (disconnectError) {
                // Validation should report auth status even if cleanup fails.
            }
        }
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

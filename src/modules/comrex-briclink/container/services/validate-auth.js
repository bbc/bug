"use strict";
const validationResult = require("@core/ValidationResult");
const comrexSocket = require("@utils/comrex-socket");

module.exports = async (formData) => {
    try {
        const device = new comrexSocket({
            host: formData.address,
            port: formData.port,
            username: formData.username,
            password: formData.password,
        });
        await device.connect();
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
            {
                state: true,
                field: "port",
                message: "Logged into device OK",
            },
        ]);
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

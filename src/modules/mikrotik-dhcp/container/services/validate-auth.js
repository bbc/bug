"use strict";
const validationResult = require("@core/validationResult");
const RosApi = require("node-routeros").RouterOSAPI;

module.exports = async (formData) => {
    try {
        const conn = new RosApi({
            host: formData.address,
            user: formData.username,
            password: formData.password,
            timeout: 3,
        });

        await conn.connect();
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

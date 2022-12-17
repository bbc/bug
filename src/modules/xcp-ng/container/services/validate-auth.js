"use strict";
const validationResult = require("@core/ValidationResult");
const { createClient } = require("xen-api");

module.exports = async (formData) => {
    try {
        const xapi = await createClient({
            url: `https://${formData.address}`,
            allowUnauthorized: true,
            auth: {
                user: formData.username,
                password: formData.password,
            },
            readOnly: false,
        });

        await xapi.connect();

        const hosts = xapi.call("host.get_all_records");
        if (hosts) {
            return new validationResult([
                {
                    state: true,
                    field: "username",
                    message: "Logged in ok",
                },
                {
                    state: true,
                    field: "password",
                    message: "Logged in ok",
                },
            ]);
        }
    } catch (error) {}
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

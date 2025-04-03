"use strict";
const validationResult = require("@core/ValidationResult");
const netgearApi = require("@utils/netgear-api");

module.exports = async (formData) => {
    try {
        console.log(formData);
        const NetgearApi = new netgearApi({
            host: formData.address,
            username: formData.username,
            password: formData.password,
        });

        const result = await NetgearApi.get({ path: "system_rfc1213" });

        if (result?.system_rfc1213) {
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

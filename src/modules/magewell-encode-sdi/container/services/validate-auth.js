"use strict";
const validationResult = require("@core/ValidationResult");
const magewellEncodeSdi = require("@utils/magewell-encode-sdi");

module.exports = async (formData) => {
    const magewellClient = magewellEncodeSdi.createClient({
        address: formData.address,
        username: formData.username,
        password: formData.password,
        apiPath: "/usapi",
        codeField: "result",
        autoLogin: false,
    });

    try {
        await magewellClient.login();
        const response = await magewellClient.request("get-status", {}, { requireAuth: false });
        console.log(response);
        if (!response?.ok) {
            throw new Error("missing status payload from magewell device");
        }
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

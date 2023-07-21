"use strict";
const validationResult = require("@core/ValidationResult");
const tielineApi = require("@utils/tieline-api");

module.exports = async (formData) => {
    try {
        const TielineApi = new tielineApi({
            host: formData.address,
            username: formData.username,
            password: formData.password,
        });

        const result = await TielineApi.get("/api/version");
        if (result?.["result"]?.["HTTP_API_VERSION"]?.["_text"]) {
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

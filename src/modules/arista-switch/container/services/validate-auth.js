"use strict";

const ValidationResult = require("@core/ValidationResult");
const aristaApi = require("@utils/arista-api");
const logger = require("@core/logger")(module);

module.exports = async (formData) => {
    try {
        const result = await aristaApi({
            host: formData.address,
            protocol: "https",
            port: 443,
            username: formData.username,
            password: formData.password,
            commands: ["show version"],
        });

        logger.info("validate-auth:", result);

        if (result?.modelName) {
            return new ValidationResult([
                { state: true, field: "username", message: "Logged into device OK" },
                { state: true, field: "password", message: "Logged into device OK" },
            ]);
        }
    } catch (err) {
        logger.error(`validate-auth: ${err.stack || err.message || err}`);
    }

    // fallback if login failed
    return new ValidationResult([
        { state: false, field: "username", message: "Could not log into device" },
        { state: false, field: "password", message: "Could not log into device" },
    ]);
};

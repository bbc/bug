"use strict";

const ciscoC1300SSH = require("@utils/ciscoc1300-ssh");
const configGet = require("@core/config-get");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info("device-save: saving device config ...");

        const result = await ciscoC1300SSH({
            host: config.address,
            username: config.username,
            password: config.password,
            timeout: 20000,
            commands: ["write memory"],
        });

        const success =
            Array.isArray(result) &&
            result.length === 1 &&
            typeof result[0] === "string" &&
            result[0].includes("Copy succeeded");

        if (!success) {
            throw new Error(
                `device did not confirm save (response: ${JSON.stringify(result)})`
            );
        }

        logger.info("device-save: success");

        await deviceSetPending(false);
    } catch (err) {
        err.message = `device-save: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

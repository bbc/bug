"use strict";

const ciscoCBSSSH = require("@utils/ciscocbs-ssh");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const deviceSetPending = require("@services/device-setpending");

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info("device-save: saving device config ...");

        result = await ciscoC1300SSH({
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

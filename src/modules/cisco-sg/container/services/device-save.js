"use strict";

const ciscoSGSSH = require("@utils/ciscosg-ssh");
const configGet = require("@core/config-get");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info("saving device config ...");

        const result = await ciscoSGSSH({
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
            throw new Error(`device did not confirm save (response: ${JSON.stringify(result)})`);
        }

        logger.info("success");

        await deviceSetPending(false);
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

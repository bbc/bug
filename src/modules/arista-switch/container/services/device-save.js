"use strict";

const configGet = require("@core/config-get");
const aristaApi = require("@utils/arista-api");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info("device-save: saving device config ...");

        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "write memory"],
        });

        logger.info("device-save: success");

    } catch (err) {
        err.message = `device-save: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
}

"use strict";

const configGet = require("@core/config-get");
const Videohub = require("@utils/videohub-promise");
const logger = require("@utils/logger")(module);

module.exports = async (name, value) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const router = new Videohub({
            host: config.address,
            port: config.port,
        });

        await router.connect();
        await router.send(
            "CONFIGURATION",
            `${name}: ${value}`,
            true
        );

        return true;

    } catch (err) {
        err.message = `deviceconfig-set: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

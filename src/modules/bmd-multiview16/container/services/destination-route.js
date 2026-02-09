"use strict";

const configGet = require("@core/config-get");
const Videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (destinationIndex, sourceIndex) => {
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
            "VIDEO OUTPUT ROUTING",
            `${destinationIndex} ${sourceIndex}`,
            true
        );

        return true;

    } catch (err) {
        err.message = `destination-route: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

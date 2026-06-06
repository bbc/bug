"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} F`;

        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);

        logger.info(`unlocked output ${index}`);
        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};

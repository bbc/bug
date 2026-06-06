"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    try {
        // validate input
        if (index === undefined || index === null || isNaN(index)) {
            throw new Error("invalid index");
        }

        // fetch config
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // create router instance
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        logger.info(`connected to router at ${config.address}:${config.port}`);

        // send unlock command
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} U`;
        await router.send(field, command, true);
        logger.info(`unlocked output ${index}`);

        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};

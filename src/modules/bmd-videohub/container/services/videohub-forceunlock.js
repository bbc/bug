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

        logger.info(`videohub-forceunlock: unlocked output ${index}`);
        return true;

    } catch (err) {
        err.message = `videohub-forceunlock: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

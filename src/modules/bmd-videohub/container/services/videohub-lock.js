"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    try {
        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // validate input
        if (index === undefined || index === null || isNaN(index)) {
            throw new Error("invalid index provided");
        }

        // prepare command
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} O`;

        // connect to videohub router
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send lock command
        await router.send(field, command, true);

        logger.info(`locked output ${index}`);
        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};

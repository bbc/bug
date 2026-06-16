"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    let router = null;
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
        router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send lock command
        await router.send(field, command);

        // Verify the lock was set
        const response = await router.query(field);
        if (!response || !response.data[index]) {
            throw new Error("Failed to verify lock setting");
        }

        logger.info(`locked output ${index}`);
        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    } finally {
        if (router) {
            await router.disconnect();
        }
    }
};

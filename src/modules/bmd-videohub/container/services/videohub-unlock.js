"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);
const cacheResponse = require("@utils/videohub-cache-response");

module.exports = async (index) => {
    let router = null;
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
        router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        logger.info(`connected to router at ${config.address}:${config.port}`);

        // send unlock command
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} U`;
        await router.send(field, command);

        // Verify the unlock was set
        const response = await router.query(field);
        if (!response || !response.data[index]) {
            throw new Error("Failed to verify unlock setting");
        }

        await cacheResponse(response);

        logger.info(`unlocked output ${index}`);

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

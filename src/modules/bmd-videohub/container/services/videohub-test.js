"use strict";

const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (address, port) => {
    let router = null;
    try {
        // validate inputs
        if (!address) throw new Error("missing host address");
        if (!port) throw new Error("missing port number");

        // create router instance
        router = new videohub({ host: address, port: port });

        // connect to router
        await router.connect();
        logger.info(`connected to ${address}:${port}`);

        // Query device info to verify connection
        const response = await router.query("VIDEOHUB DEVICE");
        if (!response || !response.data) {
            throw new Error("Failed to get device information");
        }

        logger.info("received device info from router");
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

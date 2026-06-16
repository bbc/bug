"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    let router = null;
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} F`;

        router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);

        // Verify the force unlock was set
        const response = await router.query(field);
        if (!response || !response.data[index]) {
            throw new Error("Failed to verify force unlock setting");
        }

        logger.info(`force unlocked output ${index}`);
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

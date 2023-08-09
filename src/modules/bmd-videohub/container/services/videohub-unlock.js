"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-unlock: failed to fetch config`);
        return false;
    }

    try {
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} U`;

        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);
        return true;
    } catch (error) {
        logger.error("videohub-unlock: ", error);
        return false;
    }
};

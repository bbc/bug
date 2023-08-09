"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-route: failed to fetch config`);
        return false;
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("VIDEO OUTPUT ROUTING", `${destinatonIndex} ${sourceIndex}`);
        return true;
    } catch (error) {
        logger.error("videohub-route: ", error);
        return false;
    }
};

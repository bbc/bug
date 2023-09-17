"use strict";

const configGet = require("@core/config-get");
const matrix = require("@utils/matrix");
const logger = require("@core/logger")(module);

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-route: failed to fetch config`);
        return false;
    }

    try {
        const router = new matrix({ port: config.port, host: config.address });
        await router.connect();
        await router.send("VIDEO OUTPUT ROUTING", `${destinatonIndex} ${sourceIndex}`);
        return true;
    } catch (error) {
        logger.error("matrix-route: ", error);
        return false;
    }
};

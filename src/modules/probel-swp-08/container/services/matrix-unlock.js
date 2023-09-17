"use strict";

const configGet = require("@core/config-get");
const matrix = require("@utils/matrix");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-unlock: failed to fetch config`);
        return false;
    }

    try {
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} U`;

        const router = new matrix({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);
        return true;
    } catch (error) {
        logger.error("matrix-unlock: ", error);
        return false;
    }
};

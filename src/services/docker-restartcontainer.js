"use strict";

const logger = require("@utils/logger")(module);

module.exports = async (container) => {
    try {
        logger.info(`restarting container id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.restart(function (error, data) {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.info(`container id ${container.id} restarted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to restart container id ${container.id}`);
    }
};

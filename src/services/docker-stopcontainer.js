"use strict";

const logger = require("@utils/logger")(module);

module.exports = async (container) => {
    try {
        logger.info(`stopping container id ${container?.id}`);

        return await new Promise((resolve, reject) => {
            if (!container) {
                logger.info(`container not valid`);
                reject();
            }
            container.stop(function (error, data) {
                if (error) {
                    if (error.statusCode === 304) {
                        logger.info(`container id ${container.id} already stopped`);
                        resolve(true);
                    } else {
                        logger.warning(`${error.stack || error.trace || error || error.message}`);
                        resolve(false);
                    }
                } else {
                    logger.info(`container id ${container.id} stopped OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to stop container id ${container?.id}`);
    }
};

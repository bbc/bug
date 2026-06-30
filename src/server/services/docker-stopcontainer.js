"use strict";

const logger = require("@core/logger")(module);

module.exports = async (container) => {
    if (!container || !container.id) {
        logger.warning(`attempted to stop an invalid or null container reference`);
        return false;
    }

    try {
        logger.info(`stopping container: ${container.id}`);

        return await new Promise((resolve) => {
            container.stop((error) => {
                if (error) {
                    // 304 means it's already in the desired state
                    if (error.statusCode === 304) {
                        logger.info(`container ${container.id} was already stopped.`);
                        return resolve(true);
                    }

                    logger.warning(`stop command failed for ${container.id}: ${error.message}`);
                    return resolve(false);
                }

                logger.info(`container ${container.id} stopped OK`);
                resolve(true);
            });
        });
    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to stop container ${container.id}`);
    }
};
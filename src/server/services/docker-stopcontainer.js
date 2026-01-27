"use strict";

const logger = require("@utils/logger")(module);

module.exports = async (container) => {
    if (!container || !container.id) {
        logger.warning(`docker-stopcontainer: attempted to stop an invalid or null container reference`);
        return false;
    }

    try {
        logger.info(`docker-stopcontainer: stopping container: ${container.id}`);

        return await new Promise((resolve) => {
            container.stop((error) => {
                if (error) {
                    // 304 means it's already in the desired state
                    if (error.statusCode === 304) {
                        logger.info(`docker-stopcontainer: container ${container.id} was already stopped.`);
                        return resolve(true);
                    }

                    logger.warning(`docker-stopcontainer: stop command failed for ${container.id}: ${error.message}`);
                    return resolve(false);
                }

                logger.info(`docker-stopcontainer: container ${container.id} stopped OK`);
                resolve(true);
            });
        });
    } catch (error) {
        logger.error(`docker-stopcontainer: ${error.stack}`);
        throw new Error(`Failed to stop container ${container.id}`);
    }
};
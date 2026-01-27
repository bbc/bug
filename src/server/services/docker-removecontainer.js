"use strict";

const logger = require("@utils/logger")(module);

module.exports = async (container) => {
    if (!container || !container.id) {
        logger.info(`docker-removecontainer: container reference not valid, skipping removal`);
        return true;
    }

    try {
        logger.info(`docker-removecontainer: removing container id: ${container.id}`);

        return await new Promise((resolve) => {
            container.remove({ v: true }, function (error) {
                if (error) {
                    // 404 means the container doesn't exist (already removed)
                    if (error.statusCode === 404) {
                        logger.info(`docker-removecontainer: container ${container.id} already removed (404)`);
                        return resolve(true);
                    }

                    logger.warning(`docker-removecontainer: failed to remove container ${container.id}: ${error.message}`);
                    return resolve(false);
                }

                logger.info(`docker-removecontainer: container ${container.id} removed OK`);
                resolve(true);
            });
        });
    } catch (error) {
        logger.error(`docker-removecontainer: ${error.stack}`);
        throw new Error(`Failed to remove container ${container.id}`);
    }
};
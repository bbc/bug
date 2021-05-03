'use strict';

const logger = require('@utils/logger');

module.exports = async (container) => {
    try {
        logger.info(`docker-deletecontainer: deleting container for panel id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.remove(function (error, data) {
                if (error) {
                    logger.warn(`docker-deletecontainer: ${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                }
                else {
                    logger.info(`docker-deletecontainer: container id ${container.id} deleted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`docker-deletecontainer: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete docker container for panel id ${container.id}`);
    }
}
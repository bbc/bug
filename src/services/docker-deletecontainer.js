'use strict';

const logger = require('@utils/logger')(module);

module.exports = async (container) => {
    try {
        logger.info(`deleting container for panel id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.remove(function (error, data) {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                }
                else {
                    logger.info(`container id ${container.id} deleted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete docker container for panel id ${container.id}`);
    }
}
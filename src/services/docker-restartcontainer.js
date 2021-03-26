'use strict';

const logger = require('@utils/logger');

module.exports = async (container) => {
    try {
        logger.info(`docker-startcontainer: restarting container id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.restart(function (error, data) {
                if (error) {
                    logger.warn(`docker-restartcontainer: ${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                }
                else {
                    logger.info(`docker-restartcontainer: container id ${container.id} restarted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`docker-restartcontainer: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}
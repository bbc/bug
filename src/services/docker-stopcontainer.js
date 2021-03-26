'use strict';

const logger = require('@utils/logger');

module.exports = async (container) => {
    try {
        logger.info(`docker-stopcontainer: stopping container id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.stop(function (error, data) {
                if (error) {
                    if (error.statusCode === 304) {
                        logger.info(`docker-stopcontainer: container id ${container.id} already stopped`);
                        resolve(true);
                    }
                    else {
                        logger.warn(`docker-stopcontainer: ${error.stack || error.trace || error || error.message}`);
                        resolve(false);
                    }
                }
                else {
                    logger.info(`docker-stopcontainer: container id ${container.id} stopped OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`docker-stopcontainer: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}

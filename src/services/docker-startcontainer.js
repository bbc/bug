'use strict';

const logger = require('@utils/logger');

module.exports = async (container) => {
    try {
        logger.info(`docker-startcontainer: starting container id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.start(function (error, data) {
                if (error) {
                    if (error.statusCode === 304) {
                        logger.info(`docker-startcontainer: container id ${container.id} already started`);
                        resolve(true);
                    }
                    else {
                        logger.warn(`docker-startcontainer: ${error.stack || error.trace || error || error.message}`);
                        resolve(false);
                    }
                }
                else {
                    logger.info(`docker-startcontainer: container id ${container.id} started OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`docker-startcontainer: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}
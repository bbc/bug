"use strict";

const logger = require("@core/logger")(module);

module.exports = async (container) => {
    try {
        logger.info(`deleting container for panel id ${container.id}`);

        return await new Promise((resolve, reject) => {
            container.remove(function (error, data) {
                if (error) {
                    logger.warning(`${error.stack}`);
                    resolve(false);
                } else {
                    logger.info(`container id ${container.id} deleted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`${error?.stack}`);
        throw new Error(`Failed to delete docker container for panel id ${container.id}`);
    }
};

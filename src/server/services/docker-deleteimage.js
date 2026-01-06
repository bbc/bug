"use strict";

const docker = require("@utils/docker");
const logger = require("@utils/logger")(module);

module.exports = async (imageId, force = false) => {
    try {
        logger.info(`deleting image ${imageId}`);

        return await new Promise((resolve, reject) => {
            const opts = force ? { force: true } : {};
            docker.getImage(imageId).remove(opts, function (error, data) {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.info(`image id ${imageId} deleted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.debug(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to delete docker image id ${imageId}`);
    }
};

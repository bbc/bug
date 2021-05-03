'use strict';

const docker = require('@utils/docker');
const logger = require('@utils/logger');

module.exports = async (imageId, force = false) => {
    try {
        logger.info(`docker-deleteimage: deleting image ${imageId}`);

        return await new Promise((resolve, reject) => {
            const opts = force ? { force: true } : {};
            docker.getImage(imageId).remove(opts, function (error, data) {
                if (error) {
                    logger.warn(`docker-deleteimage: ${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                }
                else {
                    logger.info(`docker-deleteimage: image id ${imageId} deleted OK`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.error(`docker-deleteimage: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete docker image id ${imageId}`);
    }
}
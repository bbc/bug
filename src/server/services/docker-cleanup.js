"use strict";

const docker = require("@utils/docker");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    let status = {};
    try {
        logger.info(`Cleaning up system to recover space.`);

        status["images"] = await new Promise((resolve, reject) => {
            logger.debug(`Pruning docker images not in use.`);
            docker.pruneImages({ filters: { dangling: { false: true } } }, (error, data) => {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.debug(`Pruned images.`);
                    resolve(true);
                }
            });
        });

        status["builders"] = await new Promise((resolve, reject) => {
            logger.debug(`Pruning docker builders not in use.`);
            docker.pruneBuilder((error, data) => {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.debug(`Pruned builders.`);
                    resolve(true);
                }
            });
        });

        status["containers"] = await new Promise((resolve, reject) => {
            logger.debug(`Pruning docker containers not in use.`);
            docker.pruneContainers((error, data) => {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.debug(`Pruned containers.`);
                    resolve(true);
                }
            });
        });

        status["volumes"] = await new Promise((resolve, reject) => {
            logger.debug(`Pruning docker volumes not in use.`);
            docker.pruneVolumes((error, data) => {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.debug(`Pruned volumes.`);
                    resolve(true);
                }
            });
        });

        status["networks"] = await new Promise((resolve, reject) => {
            logger.debug(`Pruning docker networks not in use.`);
            docker.pruneContainers((error, data) => {
                if (error) {
                    logger.warning(`${error.stack || error.trace || error || error.message}`);
                    resolve(false);
                } else {
                    logger.debug(`Pruned networks.`);
                    resolve(true);
                }
            });
        });
    } catch (error) {
        logger.debug(`${error?.stack || error?.trace || error || error?.message}`);
        status = false;
    }
    return status;
};

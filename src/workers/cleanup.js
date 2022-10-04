"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const listImages = require("@services/docker-listimages");
const deleteImage = require("@services/docker-deleteimage");
const delay = require("delay");

const cleanup = async () => {
    logger.debug(`workers/cleanup: running image cleanup`);
    const images = await listImages();
    for (let image of images) {
        try {
            let status = await deleteImage(image.tag);
            if (status) {
                logger.debug(`workers/cleanup: deleted ${image?.tag}`);
            }
        } catch (error) {
            logger.debug(`workers/cleanup: did not delete ${image?.tag}`);
        }
    }

    logger.debug(`workers/cleanup: finished image cleanup`);
};

const main = async () => {
    while (true) {
        try {
            await cleanup();
        } catch (error) {
            logger.warning(`workers/cleanup: ${error.stack || error.trace || error || error.message}`);
        }
        //Run every 30 minutes
        await delay(1800000);
    }
};

main();

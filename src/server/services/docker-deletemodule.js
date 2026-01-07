"use strict";

const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");
const dockerStopContainer = require("@services/docker-stopcontainer");
const dockerDeleteContainer = require("@services/docker-deletecontainer");
const dockerDeleteImage = require("@services/docker-deleteimage");
const listModuleImages = require("@services/docker-listmoduleimages");

module.exports = async (moduleName) => {
    try {
        // get all images associated with this module
        const imagesToDelete = await listModuleImages(moduleName);
        if (imagesToDelete.length === 0) {
            logger.info(`No images found for module ${moduleName}. Nothing to delete.`);
            return true;
        }

        logger.info(`Module ${moduleName}: found ${imagesToDelete.length} image(s) to cleanup`);

        // get all containers once
        const containers = await docker.listContainers({ all: true });

        // create a set of image ids - faster
        const imageIdSet = new Set(imagesToDelete.map(img => img.Id));

        // identify and remove containers using these images
        for (const containerInfo of containers) {
            if (imageIdSet.has(containerInfo.ImageID)) {
                // docker names usually come with a leading slash: "/panel-123"
                const rawName = containerInfo.Names[0] || containerInfo.Id;
                const containerName = rawName.startsWith('/') ? rawName.substring(1) : rawName;

                const container = docker.getContainer(containerInfo.Id);

                logger.info(`Cleaning up container ${containerName} (ID: ${containerInfo.Id.substring(0, 12)})`);

                // stop if running
                if (containerInfo.State === 'running') {
                    if (!(await dockerStopContainer(container))) {
                        throw new Error(`Failed to stop container ${containerName}`);
                    }
                    logger.info(`Stopped container: ${containerName}`);
                }

                // remove container
                if (!(await dockerDeleteContainer(container))) {
                    throw new Error(`Failed to delete container ${containerName}`);
                }
                logger.info(`Deleted container: ${containerName}`);
            }
        }

        // delete the images now that containers are gone
        for (const image of imagesToDelete) {
            // using force: true helps if there are multiple tags for the same id
            if (!(await dockerDeleteImage(image.Id, true))) {
                logger.warning(`Failed to delete image ${image.Id.substring(0, 12)}. It might be in use elsewhere.`);
                // we don't necessarily want to crash the whole process here if other images were deleted successfully
            } else {
                logger.info(`Deleted image: ${image.Id.substring(0, 12)}`);
            }
        }

        return true;
    } catch (error) {
        logger.error(`Delete Module Error: ${error.message}`, { stack: error.stack });
        throw new Error(`Failed to delete module ${moduleName}: ${error.message}`);
    }
};
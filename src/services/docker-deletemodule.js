'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');
const dockerStopContainer = require('@services/docker-stopcontainer');
const dockerDeleteContainer = require('@services/docker-deletecontainer');
const dockerDeleteImage = require('@services/docker-deleteimage');
const listModuleImages = require('@services/docker-listmoduleimages');

module.exports = async (moduleName) => {
    try {

        // get a list of image IDs which use this module name
        const imagesToDelete = listModuleImages(moduleName)

        logger.info(`docker-deletemodule: module ${moduleName}, found ` + imagesToDelete.length + ` image(s) to delete`);

        // now for each image, stop any containers that are using it
        const containers = await docker.listContainers()
        for (let image of imagesToDelete) {
            for (let eachContainer of containers) {
                if (eachContainer['ImageID'] === image.Id) {
                    // get container object
                    const panelId = eachContainer['Names'][0].replace('/', '');
                    const container = docker.getContainer(panelId);
                    // stop it
                    if (!await dockerStopContainer(container)) {
                        // it didn't stop - no point carrying on
                        throw new Error(`Failed to stop container for panel id ${panelId}, for module ${moduleName}`);
                    }
                    logger.info(`docker-deletemodule: stopped container for panel id ${panelId}`);
                    // delete it
                    if (!await dockerDeleteContainer(container)) {
                        // it didn't delete - no point carrying on
                        throw new Error(`Failed to delete container for panel id ${panelId}, for module ${moduleName}`);
                    }
                    logger.info(`docker-deletemodule: stopped container for panel id ${panelId}`);
                }
            }
        }

        // now we can delete the image itself
        for (let image of imagesToDelete) {
            if (!await dockerDeleteImage(image.Id, true)) {
                throw new Error(`Failed to delete image id ${image.Id}, for module ${moduleName}`);
            }
        }

        return true;

    } catch (error) {
        logger.error(`docker-deletemodule: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete module ${moduleName}`);
    }
}
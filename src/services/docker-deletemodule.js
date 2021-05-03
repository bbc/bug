'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');
const dockerStopContainer = require('@services/docker-stopcontainer');
const dockerDeleteContainer = require('@services/docker-deletecontainer');
const dockerDeleteImage = require('@services/docker-deleteimage');

module.exports = async (moduleName) => {
    try {

        // get a list of image IDs which use this module name
        const images = await docker.listImages()
        let imagesToDelete = [];
        for(var eachImage of images) {
            if(eachImage['RepoTags'] !== undefined) {
                for(let eachTag of eachImage['RepoTags']) {
                    let tagArray = eachTag.split(':');
                    if(tagArray.length > 0 && tagArray[0] === moduleName) {
                        imagesToDelete.push(eachImage['Id']);
                    }
                }
            }
        }
        logger.info(`docker-deletemodule: module ${moduleName}, found ` + imagesToDelete.length + ` image(s) to delete`);

        // now for each image, stop any containers that are using it
        const containers = await docker.listContainers()
        for(let eachImageId of imagesToDelete) { 
            for(let eachContainer of containers) {
                if(eachContainer['ImageID'] === eachImageId) {
                    // get container object
                    let panelId = eachContainer['Names'][0].replace('/', '');
                    var container = docker.getContainer(panelId);
                    // stop it
                    if(!await dockerStopContainer(container)) {
                        // it didn't stop - no point carrying on
                        throw new Error(`Failed to stop container for panel id ${panelId}, for module ${moduleName}`);
                    }
                    logger.info(`docker-deletemodule: stopped container for panel id ${panelId}`);
                    // delete it
                    if(!await dockerDeleteContainer(container)) {
                        // it didn't delete - no point carrying on
                        throw new Error(`Failed to delete container for panel id ${panelId}, for module ${moduleName}`);
                    }
                    logger.info(`docker-deletemodule: stopped container for panel id ${panelId}`);
                }
            }
        }

        // now we can delete the image itself
        for(let eachImageId of imagesToDelete) {
            if(!await dockerDeleteImage(eachImageId, true)) {
                throw new Error(`Failed to delete image id ${eachImageId}, for module ${moduleName}`);
            }
        }

        return true;

    } catch (error) {
        logger.error(`docker-deletemodule: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete module ${moduleName}`);
    }
}
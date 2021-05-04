'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async (moduleName) => {
    try {
        const images = await docker.listImages()
        const moduleImages = [];

        for (let image of images) {
            if (image['RepoTags'] !== undefined) {
                for (let tag of image['RepoTags']) {
                    let tagArray = tag.split(':');
                    if (tagArray.length > 0 && tagArray[0] === moduleName) {
                        moduleImages.push(image['Id']);
                    }
                }
            }
        }
        return moduleImages;

    } catch (error) {
        logger.warn(`docker-findmoduleimage: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get list of any image for module ${moduleName}`);
    }
}
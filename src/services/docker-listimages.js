'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {
    try {

        const images = await docker.listImages()
        let response = [];
        for(var eachImage of images) {
            
            response.push({
                id: eachImage["id"],
                module: eachImage.RepoTags[0].split(':')[0] ?? null,
                tag: eachImage.RepoTags[0],
                created: eachImage["Created"],
                parentId: eachImage["ParentId"],
                size: eachImage["Size"],
                virtualSize: eachImage["VirtualSize"],
            });
        }
        return response;

    } catch (error) {
        logger.error(`docker-listimages: ${error.stack || error.trace || error || error.message}`);
        return null;
    }
}
'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async (panelId) => {

    try {
        const containers = await docker.listContainers()
        if (!containers) {
            return null;
        }

        for (const eachContainer of containers) {
            if(eachContainer["Names"].length === 1) {
                let containerName = eachContainer["Names"][0].replace('/', '');
                if(containerName === panelId) {
                    return {
                        id: eachContainer["Id"],
                        name: containerName,
                        image: eachContainer["Image"],
                        created: eachContainer["Created"],
                        state: eachContainer["State"],
                        status: eachContainer["Status"]
                    }
                }
            }
        }

    } catch (error) {
        logger.error(`docker-getcontainerinfo: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get container info for panel id ${panelId}`);
    }
}
'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {

    let response = []
    try {
        const containers = await docker.listContainers()
        if (!containers) {
            return [];
        }

        for (const eachContainer of containers) {

            // check to see if this container is in the 'bug' network
            if('bug' in eachContainer.NetworkSettings.Networks) {
                if(eachContainer["Names"].length === 1) {
                    response.push({
                        id: eachContainer["Id"],
                        name: eachContainer["Names"][0].replace('/', ''),
                        image: eachContainer["Image"],
                        created: eachContainer["Created"],
                        state: eachContainer["State"],
                        status: eachContainer["Status"]
                    })
                }
            }
        }

    } catch (error) {
        logger.error(`docker-listcontainerinfo: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to list container info`);
    }

    return response

}
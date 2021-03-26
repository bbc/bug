'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {

    let response = []
    try {
        const containers = await docker.listContainers()
        // console.log(containers);
        if (containers.length > 0) {
            for (const container of containers) {
                const networks = container.NetworkSettings.Networks
                for (var network in networks) {
                    if (network === response.network_name) {
                        response.push(container)
                    }
                }
            }
        }

    } catch (error) {
        logger.warn(`panel-listcontainers: ${error.trace || error || error.message}`);
        throw (error);
    }

    return response

}
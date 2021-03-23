'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {
    const networkName = 'bug'
    try {
        const containers = await docker.listContainers()
        let containersNetwork = []
    
        if(containers.length > 0){
            for(const container of containers){
                const networks = container.NetworkSettings.Networks
                for ( var network in networks ) {
                    if(network === networkName){
                        containersNetwork.push(container)
                    }
                }
            }
        }
        return containersNetwork
    } catch (error) {
        logger.warn(`panel-list: ${error.trace || error || error.message}`);
    }

}
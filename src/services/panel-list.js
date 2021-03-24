'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {
    
    let response = {
        network_name:'bug'
    }

    try {
        const containers = await docker.listContainers()
        response.containers = []
    
        if(containers.length > 0){
            for(const container of containers){
                const networks = container.NetworkSettings.Networks
                for ( var network in networks ) {
                    if(network === response.network_name){
                        response.containers.push(container)
                    }
                }
            }
        }
        
    } catch (error) {
        response.error = error
        logger.warn(`panel-list: ${error.trace || error || error.message}`);
    }

    return response

}
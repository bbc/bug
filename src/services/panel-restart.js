'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');
const getConfig = require('@services/panel-getconfig');

module.exports = async (panelId) => {

    let response = {
        panel_id: panelId
    }

    try {
        let panelConfig = await getConfig(panelId)
        if( panelConfig.error === undefined ){
            if(panelConfig.container_id){
                const container = await docker.getContainer(panelConfig.container_id);
                response.state = await container.restart()
            }
            else{
                throw {message:"Panel has no container asccociated with it. Try starting first."}
            }
        }
        else{
            throw {message:"Invalid Panel ID. Does the panel exist?"}
        }
        
    } catch (error) {
        response.error = error
        logger.warn(__filename +': '+error);
    }

    return response
}
'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');
const getConfig = require('@services/panel-getconfig');
const setConfig = require('@services/panel-setconfig');
const panelStop = require('@services/panel-stop');

module.exports = async (panelId) => {

    let response = {
        panel_id: panelId
    }

    try {
        response.config = await getConfig(panelId)
        if( response.config.error === undefined ){
            if(response.config.container_id){
                response.container = await panelStop(panelId)
                const container = await docker.getContainer(response.config.container_id);
                response.state = await container.remove()
                delete response.config.container_id
                setConfig(response.config)
            }
        }
        else{
            throw {message:"Invalid Panel ID. Does the panel exist?"}
        }  
    } catch (error) {
        response.error = error
        logger.warn(`panel-delete: ${error.trace || error || error.message}`);
    }
    return response
}
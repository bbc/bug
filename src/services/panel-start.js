'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const config = require('@services/panel-getconfig');

module.exports = async (panelId) => {
    try {

        //STEP 1 - Build the image for the module, if it's already been done this will be quick
        const image = buildImage(panelConfig.module)
    
        //STEP 2 - Check if the container already exists, if not create one
    
        //STEP 3 - Launch the Container
    
    
        //STEP 4 - Pass the config
        state.container = docker.getContainer(panelConfig.id);        

       return
    } catch (error) {
        logger.warn(`panel-start: ${error.trace || error || error.message}`);
    }

}
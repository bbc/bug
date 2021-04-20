'use strict';

const path = require('path');
const id = require('@utils/id');
const setConfig = require('@services/panel-configset');
const moduleGet = require('@services/module-get');
const logger = require('@utils/logger');

//TODO - Are we taking the right approach here? Is there other things we want to do when a panel is added?
module.exports = async (panelConfig) => {
    try {
        //Get an ID if one hasn't been passd
        if(panelConfig.id === undefined){
            panelConfig.id = await id();
        }

        //Merge config passed with default module config
        const module = await moduleGet(panelConfig.module);
        panelConfig = { ...module?.defaultconfig, ...panelConfig };

        const status = await setConfig(panelConfig);
        return status;

    } catch (error) {
        logger.warn(`panel-add: ${error.stack | error.trace || error || error.message}`);
    }
    return false;
}
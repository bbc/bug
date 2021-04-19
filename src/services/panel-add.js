'use strict';

const path = require('path');
const id = require('@utils/id');
const setConfig = require('@services/panel-configset');
const logger = require('@utils/logger');

//TODO - Are we taking the right approach here? Is there other things we want to do when a panel is added?

module.exports = async (panelConfig) => {
    try {
        if(panelConfig.id === undefined){
            panelConfig.id = await id()
        }
        const status = await setConfig(panelConfig)
        return status;

    } catch (error) {
        logger.warn(`panel-add: ${error.stack | error.trace || error || error.message}`);
    }
    return false;
}
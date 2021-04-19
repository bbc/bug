'use strict';

const path = require('path');
const id = require('@utils/id');
const setConfig = require('@services/panel-configset');
const logger = require('@utils/logger');

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
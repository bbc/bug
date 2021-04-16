'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const id = require('@utils/id');
const setConfig = require('@services/panel-configset');

module.exports = async (panelConfig) => {

    // SORRY - I need to rethink this

    // let response = {
    //     config: panelConfig
    // }

    // try {
    //     if(panelConfig.id === undefined){
    //         panelConfig.id = await id()
    //     }
    //     response = await setConfig(panelConfig)
    // }
    // catch (error) {
    //     logger.error(`panel-add: ${error.stack || error.trace || error || error.message}`);
    //     return false;
    // }

    // return response
}
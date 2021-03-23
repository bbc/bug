'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const config = require('@services/panel-getconfig');

module.exports = async (panelId) => {
    try {
       return docker.startContainer(await config(panelId))
    } catch (error) {
        logger.warn(`panel-start: ${error.trace || error || error.message}`);
    }

}
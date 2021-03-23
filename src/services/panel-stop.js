'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async (panelId) => {
    try {
        await docker.getContainer(panelId).stop(cb)
        return
    } catch (error) {
        logger.warn(`panel-stop: ${error.trace || error || error.message}`);
    }

}
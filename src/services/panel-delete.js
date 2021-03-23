'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async (panelId) => {
    try {
        const container = await docker.getContainer(panelId);
        const data = await container.inspect()
        container.remove();
        return
        
    } catch (error) {
        logger.warn(`panel-delete: ${error.trace || error || error.message}`);
    }

}
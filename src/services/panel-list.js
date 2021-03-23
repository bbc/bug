'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async () => {
    try {
        return await docker.listContainers('bug')
    } catch (error) {
        logger.warn(`panel-list: ${error.trace || error || error.message}`);
    }

}
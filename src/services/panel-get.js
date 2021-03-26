'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const moduleConfig = require('@models/module-config');
const dockerGetContainerInfo = require('@services/docker-getcontainerinfo');

module.exports = async (panelId) => {
    try {
        const panel = await panelConfig.get(panelId);

        // also fetch module info
        const panelModule = await moduleConfig.get(panel['module']);

        // also fetch container info
        const containerInfo = await dockerGetContainerInfo(panelId);

        // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
        delete panelModule.defaultconfig;

        return {
            id: panel['id'],
            order: panel['order'],
            title: panel['title'],
            enabled: panel['enabled'],
            module: panel['module'],
            _module: panelModule,
            _container: containerInfo
        };

    } catch (error) {
        logger.warn(`panel-get: ${error.trace || error || error.message}`);
    }
    return null;
}



'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const moduleConfigModel = require('@models/module-config');
const panelBuildStatusModel = require('@models/panel-buildstatus');
const dockerGetContainerInfo = require('@services/docker-getcontainerinfo');

module.exports = async (panelId) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);

        // also fetch module info
        const moduleConfig = await moduleConfigModel.get(panelConfig['module']);

        // also fetch container info
        const containerInfo = await dockerGetContainerInfo(panelId);

        // and fetch status from db
        const panelBuildStatus = await panelBuildStatusModel.get(panelId);

        // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
        delete moduleConfig.defaultconfig;

        return {
            id: panelConfig['id'],
            order: panelConfig['order'],
            title: panelConfig['title'],
            enabled: panelConfig['enabled'],
            module: panelConfig['module'],
            _module: moduleConfig,
            _container: containerInfo,
            _buildstatus: panelBuildStatus
        };

    } catch (error) {
        logger.warn(`panel-get: ${error.stack | error.trace || error || error.message}`);
    }
    return null;
}



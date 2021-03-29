'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const moduleConfigModel = require('@models/module-config');
const panelBuildStatusModel = require('@models/panel-buildstatus');
const dockerGetContainerInfo = require('@services/docker-getcontainerinfo');
const panelFilter = require('@filters/panel');

module.exports = async (panelId) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        const moduleConfig = await moduleConfigModel.get(panelConfig['module']);
        const containerInfo = await dockerGetContainerInfo(panelId);
        const panelBuildStatus = await panelBuildStatusModel.get(panelId);

        return panelFilter(panelConfig, moduleConfig, containerInfo, null);

    } catch (error) {
        logger.warn(`panel-get: ${error.stack | error.trace || error || error.message}`);
    }
    return null;
}



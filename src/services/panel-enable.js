'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const panelStart = require('@services/panel-start');

module.exports = async (panelId) => {

    try {

        var panelConfig = await panelConfigModel.get(panelId);
        if(!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        // first of all we enable in the config
        panelConfig.enabled = true;

        // and save
        if(!await panelConfigModel.set(panelConfig)) {
            throw new Error(`Failed to set config of panel id ${panelId} to enabled`);
        }

        // then we stop the container in docker
        logger.info(`panel-enable: starting container for panel id ${panelId}`);
        return await panelStart(panelId);

    } catch (error) {
        logger.warn(`panel-enable: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to enable panel id ${panelId}`);
    }
}
'use strict';

const logger = require('@utils/logger')(module);
const panelConfigModel = require('@models/panel-config');
const panelStart = require('@services/panel-start');

module.exports = async (panelId) => {

    try {
        logger.action(`Enabling panel - ${panelId}`);

        const panelConfig = await panelConfigModel.get(panelId);
        if(!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        // first of all we enable in the config
        panelConfig.enabled = true;

        // and save
        if(!await panelConfigModel.set(panelConfig)) {
            throw new Error(`Failed to set config of panel id ${panelId} to enabled`);
        }

        // then we start the container in docker
        return await panelStart(panelId);

    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to enable panel id ${panelId}`);
    }
}
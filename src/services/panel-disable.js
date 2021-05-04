'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const panelStop = require('@services/panel-stop');

module.exports = async (panelId) => {

    try {

        var panelConfig = await panelConfigModel.get(panelId);
        if(!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        // first of all we disable in the config
        panelConfig.enabled = false;

        // and save
        if(!await panelConfigModel.set(panelConfig)) {
            throw new Error(`Failed to set config of panel id ${panelId} to disabled`);
        }

        // then we stop the container in docker
        return await panelStop(panelId);

    } catch (error) {
        logger.warn(`panel-disable: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to disable panel id ${panelId}`);
    }
}
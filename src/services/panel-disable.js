'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');

module.exports = async (panelId) => {

    try {

        var panelConfig = await panelConfigModel.get(panelId);
        if(!panelConfig) {
            logger.warn(`panel-disable: panel ${panelId} not found`);
            return false
        }

        panelConfig.enabled = false;

        await panelConfigModel.set(panelConfig);
        return true;

    } catch (error) {
        logger.error(`panel-disable: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}
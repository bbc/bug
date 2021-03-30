'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');

module.exports = async (panelId) => {

    try {

        var panelConfig = await panelConfigModel.get(panelId);
        if(!panelConfig) {
            logger.warn(`panel-enable: panel ${panelId} not found`);
            return false
        }

        panelConfig.enabled = true;

        return await panelConfigModel.set(panelConfig);

    } catch (error) {
        logger.error(`panel-enable: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}
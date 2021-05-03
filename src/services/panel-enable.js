'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');

module.exports = async (panelId) => {

    try {

        var panelConfig = await panelConfigModel.get(panelId + "aaaa");
        if(!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        panelConfig.enabled = true;

        await panelConfigModel.set(panelConfig);
        return true;

    } catch (error) {
        logger.warn(`panel-enable: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to enable panel id ${panelId}`);
    }
}
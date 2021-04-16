'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');

module.exports = async (newConfig) => {
    try {
        const config = await panelConfigModel.get(newConfig?.id);
        const status = await panelConfigModel.set({ ...config, ...newConfig});
        return status;

    } catch (error) {
        logger.warn(`panel-setconfig: ${error.stack | error.trace || error || error.message}`);
    }
    return false;
}
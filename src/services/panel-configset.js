'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const panelConfigPush = require('@services/panel-configpush');

module.exports = async (newConfig) => {
    try {
        // fetch existing config
        const config = await panelConfigModel.get(newConfig?.id);

        // merge existing with config from UI
        const status = await panelConfigModel.set({ ...config, ...newConfig});

        if(!status) {
            throw 'failed to merge panel configs';
        }

        // push config to any running module and return result bool
        return await panelConfigPush(newConfig?.id);

    } catch (error) {
        logger.warn(`panel-setconfig: ${error.stack | error.trace || error || error.message}`);
    }
    return false;
}
'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const panelConfigPush = require('@services/panel-configpush');
const moduleGet = require('@services/module-get');

module.exports = async (newConfig) => {
    try {
        // fetch existing config
        const config = await panelConfigModel.get(newConfig?.id);
        
        const module = await moduleGet(config.module)
        // merge existing with config from UI
        const status = await panelConfigModel.set({ ...config, ...newConfig});

        if(!status) {
            throw new Error(`Failed to merge panel configs`);
        }

        // push config to any running module and return result bool
        if(module.needsContainer){
            return await panelConfigPush(newConfig?.id);
        }

        return status

    } catch (error) {
        logger.warn(`panel-setconfig: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to set panel config to ${url}`);
    }
}
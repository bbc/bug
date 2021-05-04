'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const panelConfigPush = require('@services/panel-configpush');
const moduleGet = require('@services/module-get');

module.exports = async (newConfig) => {
    try {
        // fetch existing config
        const config = await panelConfigModel.get(newConfig?.id);
        const combinedConfig = { ...config, ...newConfig};

        // merge existing with config from UI
        const status = await panelConfigModel.set(combinedConfig);

        if(!status) {
            throw new Error(`Failed to merge panel configs`);
        }

        const module = await moduleGet(combinedConfig.module);

        // push config to any running module and return result bool
        if(module.needsContainer){
            return await panelConfigPush(newConfig?.id);
        }

        return status

    } catch (error) {
        logger.warn(`panel-configset: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to set panel config to ${url}`);
    }
}
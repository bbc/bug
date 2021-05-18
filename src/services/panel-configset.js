'use strict';

const logger = require('@utils/logger')(module);
const panelConfigModel = require('@models/panel-config');
const panelConfigPush = require('@services/panel-configpush');
const moduleGet = require('@services/module-get');

module.exports = async (newConfig) => {
    try {
        // fetch existing config
        const config = await panelConfigModel.get(newConfig?.id);
        // merge existing with config from UI
        const combinedConfig = { ...config, ...newConfig};
        
        //Module has been configured, so set the flag
        combinedConfig.needsConfigured = false;

        // and save it to a file
        if(!await panelConfigModel.set(combinedConfig)) {
            throw new Error(`Failed to merge panel configs`);
        }

        // get the module (so we can check if it needs a container)
        const module = await moduleGet(combinedConfig.module);

        if(!module.needsContainer){
            return true;
        }
        // push config to any running module and return result bool
        return await panelConfigPush(newConfig?.id);

    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to set panel config to ${url}`);
    }
}
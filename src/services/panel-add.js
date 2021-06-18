"use strict";

const id = require("@utils/id");
const panelConfigModel = require("@models/panel-config");
const moduleGet = require("@services/module-get");
const logger = require("@utils/logger")(module);

module.exports = async (panelConfig) => {
    try {
        // get an ID if one hasn't been passd
        if (panelConfig.id === undefined) {
            panelConfig.id = await id();
        }

        // merge config passed with default module config
        const module = await moduleGet(panelConfig.module);
        if (!module) {
            throw new Error(`Module ${module} not found`);
        }
        panelConfig = { ...module?.defaultconfig, ...panelConfig };

        // and save it to a file
        return await panelConfigModel.set(panelConfig);
    } catch (error) {
        logger.warning(`${error.stack | error.trace || error || error.message}`);
        throw new Error(`Failed to add panel`);
    }
};

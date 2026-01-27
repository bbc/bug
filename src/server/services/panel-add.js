"use strict";

const id = require("@utils/id");
const panelConfigModel = require("@models/panel-config");
const moduleGet = require("@services/module-get");
const logger = require("@utils/logger")(module);
const panelStart = require("@services/panel-start");
const key = require("@utils/key");

module.exports = async (panelConfig) => {
    try {
        // get an ID if one hasn't been passd
        if (panelConfig.id === undefined) {
            panelConfig.id = await id();
        }

        // create an API key for the panel
        panelConfig.key = await key();

        // merge config passed with default module config
        const module = await moduleGet(panelConfig.module);
        if (!module) {
            throw new Error(`Module ${module} not found`);
        }
        panelConfig = { ...module?.defaultconfig, ...panelConfig };

        // make sure it's enabled (we do this now - it's a thing)
        panelConfig.enabled = true;

        // and save it to a file
        if (!(await panelConfigModel.set(panelConfig))) {
            throw new Error(`Failed to save new config for id ${panelConfig.id}`);
        }

        // and now build it
        panelStart(panelConfig.id);
        return true;
    } catch (error) {
        logger.warning(`panel-add: ${error.stack}`);
        throw new Error(`Failed to add panel`);
    }
};

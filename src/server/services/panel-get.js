"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const moduleConfigModel = require("@models/module-config");
const panelBuildStatusModel = require("@models/panel-buildstatus");
const moduleUpgradeStatusModel = require("@models/module-upgradestatus");
const dockerContainerModel = require("@models/docker-container");
const panelFilter = require("@filters/panel");
const panelStatusModel = require("@models/panel-status");
const dockerListImages = require("@services/docker-listimages");

module.exports = async (panelId) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        const moduleConfig = await moduleConfigModel.get(panelConfig["module"]);
        const containerInfo = await dockerContainerModel.get(panelId);
        const panelBuildStatus = await panelBuildStatusModel.get(panelId);
        const moduleUpgradeStatus = await moduleUpgradeStatusModel.get(panelConfig["module"]);
        const panelStatus = await panelStatusModel.get(panelId);
        const dockerImages = await dockerListImages();
        const builtModules = dockerImages?.map((m) => m.module) || [];

        return panelFilter(panelConfig, moduleConfig, containerInfo, panelBuildStatus, panelStatus, moduleUpgradeStatus, builtModules);
    } catch (error) {
        logger.error(`panel-get: ${error.stack}`);
        throw new Error(`Failed to get panel id ${panelId}`);
    }
};

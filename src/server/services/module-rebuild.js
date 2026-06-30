"use strict";

const path = require("path");
const logger = require("@core/logger")(module);
const dockerDeleteModule = require("@services/docker-deletemodule");
const dockerBuildModule = require("@services/docker-buildmodule");
const moduleConfig = require("@models/module-config");
const dockerFileWrite = require("@services/dockerfile-write");
const moduleUpgradeStatusModel = require("@models/module-upgradestatus");
const panelConfigModel = require("@models/panel-config");
const panelStart = require("@services/panel-start");

module.exports = async (moduleName, updateProgressCallback) => {
    try {
        // fetch module config
        const moduleList = await moduleConfig.list();
        const matchedModule = moduleList.find(m => m.name === moduleName);

        if (!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        // get all panels using this module before we delete anything
        const allPanels = await panelConfigModel.list();
        const affectedPanelIds = allPanels
            .filter(p => p.module === moduleName && p.enabled)
            .map(p => p.id);

        if (affectedPanelIds.length > 0) {
            logger.info(`module-rebuild: found ${affectedPanelIds.length} panel(s) using module ${moduleName}: ${affectedPanelIds.join(", ")}`);
        }

        // update the UI to show we're building
        await moduleUpgradeStatusModel.create(moduleName)

        // delete existing module images/containers - we do this first to ensure the build isn't using cached layers we want gone
        logger.info(`module-rebuild: deleting existing module assets for: ${moduleName}`);
        const deleted = await dockerDeleteModule(moduleName);
        if (!deleted) {
            logger.warning(`module-rebuild: could not fully delete assets for ${moduleName} - proceeding with build anyway`);
        }

        // write/update the dockerfile
        const modulePath = path.resolve(__dirname, "..", "..", "modules", moduleName, "container");

        const fileWriteSuccess = await dockerFileWrite(modulePath, moduleName);
        if (!fileWriteSuccess) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }

        // trigger the build
        logger.info(`module-rebuild: rebuilding image for ${moduleName}...`);
        const result = await dockerBuildModule(moduleName, updateProgressCallback);

        // restart affected panels after successful rebuild
        if (affectedPanelIds.length > 0) {
            logger.info(`module-rebuild: restarting ${affectedPanelIds.length} panel(s) after rebuild`);
            for (const panelId of affectedPanelIds) {
                try {
                    logger.info(`module-rebuild: starting panel ${panelId}`);
                    await panelStart(panelId);
                } catch (error) {
                    logger.warning(`module-rebuild: failed to start panel ${panelId}: ${error.message}`);
                }
            }
        }

        await moduleUpgradeStatusModel.delete(moduleName)
        return result


    } catch (error) {
        logger.error(`module-rebuild: ${error.stack}`);
        throw new Error(`Failed to rebuild module ${moduleName}: ${error.message}`);
    }
};
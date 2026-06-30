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

const activeRebuilds = new Set();

module.exports = async (moduleName, updateProgressCallback) => {
    if (activeRebuilds.has(moduleName)) {
        const error = new Error(`Module '${moduleName}' upgrade already in progress`);
        error.code = "MODULE_UPGRADE_IN_PROGRESS";
        throw error;
    }

    activeRebuilds.add(moduleName);

    const updateProgress = (progressText) => {
        if (typeof updateProgressCallback === 'function') {
            updateProgressCallback(progressText);
        }
    };

    let upgradeStatusCreated = false;

    try {
        updateProgress("Validating module config");

        // fetch module config
        const moduleList = await moduleConfig.list();
        const matchedModule = moduleList.find(m => m.name === moduleName);

        if (!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        updateProgress("Identifying affected panels");

        // get all panels using this module before we delete anything
        const allPanels = await panelConfigModel.list();
        const affectedPanelIds = allPanels
            .filter(p => p.module === moduleName && p.enabled)
            .map(p => p.id);

        if (affectedPanelIds.length > 0) {
            logger.info(`found ${affectedPanelIds.length} panel(s) using module ${moduleName}: ${affectedPanelIds.join(", ")}`);
        }

        // update the UI to show we're building
        upgradeStatusCreated = await moduleUpgradeStatusModel.create(moduleName)

        // delete existing module images/containers - we do this first to ensure the build isn't using cached layers we want gone
        updateProgress("Stopping containers");
        logger.info(`deleting existing module assets for: ${moduleName}`);
        const deleted = await dockerDeleteModule(moduleName);
        if (!deleted) {
            logger.warning(`could not fully delete assets for ${moduleName} - proceeding with build anyway`);
        }
        updateProgress("Removing images");

        // write/update the dockerfile
        const modulePath = path.resolve(__dirname, "..", "..", "modules", moduleName, "container");

        const fileWriteSuccess = await dockerFileWrite(modulePath, moduleName);
        if (!fileWriteSuccess) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }

        // trigger the build
        updateProgress("Building image");
        logger.info(`rebuilding image for ${moduleName}...`);
        const result = await dockerBuildModule(moduleName, updateProgress);

        // restart affected panels after successful rebuild
        if (affectedPanelIds.length > 0) {
            updateProgress("Restarting panels");
            logger.info(`restarting ${affectedPanelIds.length} panel(s) after rebuild`);
            for (let i = 0; i < affectedPanelIds.length; i++) {
                const panelId = affectedPanelIds[i];
                try {
                    updateProgress(`Restarting panel ${i + 1} of ${affectedPanelIds.length}`);
                    logger.info(`starting panel ${panelId}`);
                    await panelStart(panelId);
                } catch (error) {
                    logger.warning(`failed to start panel ${panelId}: ${error.message}`);
                }
            }
        }

        updateProgress("Rebuild complete");
        return result


    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to rebuild module ${moduleName}: ${error.message}`);
    } finally {
        activeRebuilds.delete(moduleName);

        if (upgradeStatusCreated) {
            const deleted = await moduleUpgradeStatusModel.delete(moduleName);
            if (!deleted) {
                logger.warning(`failed to clear module upgrade status for ${moduleName}`);
            }
        }
    }
};
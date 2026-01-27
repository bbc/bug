"use strict";

const logger = require("@utils/logger")(module);
const moduleConfig = require("@models/module-config");
const dockerListImages = require("@services/docker-listimages");
const settingsModel = require("@models/settings");

module.exports = async () => {
    try {
        const images = await dockerListImages();
        const settings = await settingsModel.get();
        let moduleList = await moduleConfig.list();

        if (settings?.moduleStatus) {
            moduleList = moduleList.filter((module) =>
                settings.moduleStatus.includes(module.status)
            );
        }

        const imageMap = new Map(images.map(img => [img.module, img]));

        const response = moduleList.map((eachModule) => {

            if (imageMap.has(eachModule.name)) {
                eachModule.image = imageMap.get(eachModule.name);
            }

            delete eachModule.defaultconfig;
            delete eachModule.devmounts;

            return eachModule;
        });

        response.sort((a, b) => {
            const nameA = a.longname?.toLowerCase() || "";
            const nameB = b.longname?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
        });

        return response;

    } catch (error) {
        logger.warning(`module-list: ${error.stack}`);
        throw new Error(`Failed to get module list`);
    }
};
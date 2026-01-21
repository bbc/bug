"use strict";

const logger = require("@utils/logger")(module);
const moduleConfig = require("@models/module-config");
const dockerListImages = require("@services/docker-listimages");
const settingsModel = require("@models/settings");

module.exports = async () => {
    let response = [];

    const images = await dockerListImages();
    const settings = await settingsModel.get();

    // filter out the modules according to user set beta/stable
    let moduleList = await moduleConfig.list();

    // handle field not being avalible in settings
    if (settings?.moduleStatus) {
        moduleList = moduleList.filter((module) => {
            let statusMatch = false;
            for (let status of settings.moduleStatus) {
                if (status === module.status) {
                    statusMatch = true;
                    break;
                }
            }
            return statusMatch;
        });
    }

    try {
        for (let eachModule of moduleList) {
            for (const eachImage of images) {
                if (eachImage.module === eachModule.name) {
                    eachModule.image = eachImage;
                }
            }
            delete eachModule.defaultconfig;
            delete eachModule.devmounts;
            response.push(eachModule);
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
        throw new Error(`Failed to get module list`);
    }

    return response;
};

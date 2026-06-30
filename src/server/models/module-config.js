"use strict";

//TODO error handling with throw

const { promises: fs } = require("fs");
const path = require("path");
const logger = require("@core/logger")(module);
const readJson = require("@core/read-json");
const cacheStore = require("@core/cache-store");

exports.list = async function () {
    const cacheKey = "moduleConfig";
    const modulesFolder = path.join(__dirname, "..", "..", "modules");

    // check the cache first
    let moduleArray = cacheStore.get(cacheKey);

    if (!moduleArray) {
        let files;
        try {
            files = await fs.readdir(modulesFolder);
        } catch (error) {
            logger.warning(`${error.stack || error || error.message}`);
        }

        moduleArray = [];
        for (let i in files) {
            if (!files[i].startsWith(".")) {
                const filename = path.join(modulesFolder, files[i], "module.json");
                try {
                    let packageFile = await readJson(filename);
                    if (!packageFile) {
                        logger.warning(`file '${filename}' not found`);
                        return null;
                    }
                    moduleArray.push(packageFile);
                } catch (error) {
                    if (error?.code === "ENOENT") {
                        const moduleName = files[i];
                        let panelId = "none";

                        try {
                            const panelConfigModel = require("@models/panel-config");
                            const panelConfigList = await panelConfigModel.list();

                            const panelConfig = panelConfigList.find((panel) => panel?.module === moduleName);
                            panelId = panelConfig?.id || "none";
                        } catch (contextError) {
                            logger.warning(`failed to load panel context: ${contextError.stack || contextError || contextError.message}`);
                        }

                        logger.warning(
                            `cannot find configuration for module '${moduleName}', panel id: ${panelId}`
                        );
                    } else {
                        logger.warning(`${error.stack || error || error.message}`);
                    }
                }
            }
        }

        // cache the result
        cacheStore.set(cacheKey, moduleArray, 60);
    }
    return moduleArray;
};

exports.get = async function (moduleName) {
    try {
        let moduleList = await exports.list();
        for (let i in moduleList) {
            if (moduleList[i]["name"] === moduleName) {
                return moduleList[i];
            }
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }

    return null;
};

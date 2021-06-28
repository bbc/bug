"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const moduleConfigModel = require("@models/module-config");
const panelFilter = require("@filters/panel");
const panelBuildStatusModel = require("@models/panel-buildstatus");
const panelStatusModel = require("@models/panel-status");
const dockerContainerModel = require("@models/docker-container");
const cacheStore = require("@core/cache-store");

module.exports = async () => {
    try {
        const cacheKey = "panelList";

        // check the cache first
        const cachedValue = cacheStore.get(cacheKey);
        if (cachedValue) {
            return cachedValue;
        }

        const panelConfig = await panelConfigModel.list();
        const moduleConfig = await moduleConfigModel.list();

        const containerInfoList = await dockerContainerModel.list();
        const panelBuildStatus = await panelBuildStatusModel.list();

        const panelStatus = await panelStatusModel.list({ noTimestamps: true });

        const filteredPanelList = [];
        for (const eachPanelConfig of panelConfig) {
            const thisModuleConfig = moduleConfig.find((o) => o.name === eachPanelConfig["module"]) ?? null;
            if (thisModuleConfig) {
                const thisStatus = panelStatus ? panelStatus.find((o) => o.panelId === eachPanelConfig["id"]) : null;
                const thisContainerInfo =
                    containerInfoList !== null ? containerInfoList.find((o) => o.name === eachPanelConfig["id"]) : null;
                const thisBuild =
                    panelBuildStatus !== null
                        ? panelBuildStatus.find((o) => o.panelid === eachPanelConfig["id"])
                        : null;

                // the build list returns a nested 'status' object, direct from the database - we need to pull it out
                let thisBuildStatus = null;
                if (thisBuild) {
                    thisBuildStatus = thisBuild["status"];
                }

                // remove unneeded fields from moduleConfig
                delete thisModuleConfig.devmounts;
                delete thisModuleConfig.license;
                delete thisModuleConfig.author;

                // combine them
                filteredPanelList.push(
                    panelFilter(eachPanelConfig, thisModuleConfig, thisContainerInfo, thisBuildStatus, thisStatus)
                );
            }
        }

        filteredPanelList.sort(function (a, b) {
            return a.order < b.order ? -1 : 1;
        });

        cacheStore.set(cacheKey, filteredPanelList, 1);

        return filteredPanelList;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get panel list`);
    }
};

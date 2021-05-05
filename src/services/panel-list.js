'use strict';

const logger = require('@utils/logger')(module);
const panelConfigModel = require('@models/panel-config');
const moduleConfigModel = require('@models/module-config');
const panelFilter = require('@filters/panel');
const panelBuildStatusModel = require('@models/panel-buildstatus');
const dockerContainerModel = require('@models/docker-container');

module.exports = async () => {
    try {
        
        const panelConfig = await panelConfigModel.list();
        const moduleConfig = await moduleConfigModel.list();
        const containerInfoList = await dockerContainerModel.list();
        const panelBuildStatus = await panelBuildStatusModel.list();

        const filteredPanelList = [];
        for (const i in panelConfig) {
            const thisModuleConfig = moduleConfig.find(o => o.name === panelConfig[i]['module']) ?? null;
            if(thisModuleConfig) {
                const thisContainerInfo = containerInfoList.find(o => o.name === panelConfig[i]['id']) ?? null;
                const thisBuild = panelBuildStatus.find(o => o.panelid === panelConfig[i]['id']) ?? null;
                // the build list returns a nested 'status' object, direct from the database - we need to pull it out
                const thisBuildStatus = (thisBuild === null) ? null : thisBuild['status'];

                // remove unneeded fields from moduleConfig
                delete thisModuleConfig.devmounts;
                delete thisModuleConfig.license;
                delete thisModuleConfig.author;

                // combine them
                filteredPanelList.push(
                    panelFilter(panelConfig[i], thisModuleConfig, thisContainerInfo, thisBuildStatus)
                );
            }
        }

        filteredPanelList.sort(function (a, b) {
            return (a.order < b.order) ? -1 : 1;
        });
        return filteredPanelList;
    } catch (error) {
        logger.warn(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get panel list`);
    }

}

'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const moduleConfigModel = require('@models/module-config');
const dockerListContainerInfo = require('@services/docker-listcontainerinfo');
const panelFilter = require('@filters/panel');
const panelBuildStatusModel = require('@models/panel-buildstatus');

module.exports = async () => {
    const panelConfig = await panelConfigModel.list();
    const moduleConfig = await moduleConfigModel.list();
    const containerInfoList = await dockerListContainerInfo();
    const panelBuildStatus = await panelBuildStatusModel.list();

    var filteredPanelList = [];
    for (var i in panelConfig) {
        var thisModuleConfig = moduleConfig.find(o => o.name === panelConfig[i]['module']) ?? null;
        if(thisModuleConfig) {
            var thisContainerInfo = containerInfoList.find(o => o.name === panelConfig[i]['id']) ?? null;
            var thisBuildStatus = panelBuildStatus.find(o => o.panelid === panelConfig[i]['id']) ?? null;

            filteredPanelList.push(
                panelFilter(panelConfig[i], thisModuleConfig, thisContainerInfo, thisBuildStatus)
            );
        }
    }

    filteredPanelList.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return filteredPanelList;
}

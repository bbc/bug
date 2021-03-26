'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const moduleConfig = require('@models/module-config');
const dockerListContainerInfo = require('@services/docker-listcontainerinfo');

module.exports = async () => {
    const panelList = await panelConfig.list();

    // also fetch module info
    const moduleList = await moduleConfig.list();

    // also fetch container info
    const containerList = await dockerListContainerInfo();

    var filteredPanelList = [];
    for (var i in panelList) {
        var panelModule = moduleList.find(o => o.name === panelList[i]['module']) ?? null;
        if(panelModule) {
            var panelContainer = containerList.find(o => o.name === panelList[i]['id']) ?? null;

            // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
            delete panelModule.defaultconfig;

            filteredPanelList.push({
                id: panelList[i]['id'],
                order: panelList[i]['order'],
                title: panelList[i]['title'],
                enabled: panelList[i]['enabled'],
                module: panelList[i]['module'],
                _module: panelModule,
                _container: panelContainer
            });
        }
    }

    filteredPanelList.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return filteredPanelList;
}

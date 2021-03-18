'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const modulePackage = require('@models/module-package');

module.exports = async () => {
    let panelList = await panelConfig.list();

    // also fetch module info
    let moduleList = await modulePackage.list();

    var filteredPanelList = [];
    for(var i in panelList) {
        var module = moduleList.find(o => o.name === panelList[i]['module']) ?? {};
        filteredPanelList.push({
            id: panelList[i]['id'],
            order: panelList[i]['order'],
            title: panelList[i]['title'],
            enabled: panelList[i]['enabled'],
            module: panelList[i]['module'],
            _module_name: (module['name'] ?? 'Unknown'),
            _module_icon: (module['icon'] ?? ''),
        });
    }

    filteredPanelList.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return filteredPanelList;
}
'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const modulePackage = require('@models/module-package');
const panelListContainers = require('@services/panel-listcontainers');

module.exports = async () => {
    const panelList = await panelConfig.list();

    // also fetch module info
    const moduleList = await modulePackage.list();

    // also fetch container info
    // const containerList = await panelListContainers();
    //TODO - in a minute (GH)

    var filteredPanelList = [];
    for (var i in panelList) {
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



// 'use strict';

// const logger = require('@utils/logger');
// const panelListContainers = require('@services/panel-listcontainers');

// module.exports = async () => {

//     let response = [];

//     const containers = await panelListContainers();

//     containers.map((container) => {
//         var panel = {
//             'id': containersp
//         };
//     })}

//     try {
//         const containers = await docker.listContainers()
//         response.containers = []

//         if(containers.length > 0){
//             for(const container of containers){
//                 const networks = container.NetworkSettings.Networks
//                 for ( var network in networks ) {
//                     if(network === response.network_name){
//                         response.containers.push(container)
//                     }
//                 }
//             }
//         }

//     } catch (error) {
//         response.error = error
//         logger.warn(`panel-list: ${error.trace || error || error.message}`);
//     }

//     return response

// }
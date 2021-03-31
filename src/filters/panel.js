'use strict';

module.exports = (panelConfig, moduleConfig, containerInfo, panelBuildStatus) => {

    // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
    delete moduleConfig.defaultconfig;

    let isRunning = (containerInfo && containerInfo.state === "running") ?? false;
    let isBuilding = (!isRunning && (panelBuildStatus !== null) && panelBuildStatus.progress > -1) ?? false;
    let isBuilt = (panelBuildStatus !== null) ?? false;

    return {
        id: panelConfig['id'],
        order: panelConfig['order'],
        title: panelConfig['title'],
        enabled: panelConfig['enabled'],
        module: panelConfig['module'],
        _module: moduleConfig,
        _container: containerInfo,
        _buildstatus: panelBuildStatus,
        _isrunning: isRunning,
        _isbuilding: isBuilding,
        _isbuilt: isBuilt
    };
}
"use strict";

module.exports = (panelConfig, moduleConfig, containerInfo, panelBuildStatus) => {
    // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
    delete moduleConfig.defaultconfig;

    let isRunning = (containerInfo && containerInfo.state === "running") ?? false;
    let isBuilding = (!isRunning && panelBuildStatus !== null && panelBuildStatus.progress > -1) ?? false;
    let isBuilt = panelBuildStatus !== null ?? false;

    let status = "idle";
    if (!moduleConfig.needsContainer) {
        status = panelConfig["enabled"] ? "active" : "idle";
    } else if (isRunning) {
        status = panelConfig["enabled"] ? "running" : "stopping";
    } else if (isBuilding) {
        status = "building";
    } else if (isBuilt) {
        if (panelBuildStatus.error) {
            status = "error";
        }
        else if(panelConfig["enabled"]) {
            status = "starting";
        }
    }

    return {
        id: panelConfig["id"],
        order: panelConfig["order"],
        title: panelConfig["title"],
        description: panelConfig["description"],
        enabled: panelConfig["enabled"],
        module: panelConfig["module"],
        _module: moduleConfig,
        _container: containerInfo,
        _buildstatus: panelBuildStatus,
        _isrunning: isRunning,
        _isbuilding: isBuilding,
        _isbuilt: isBuilt,
        _status: status
    };
};

"use strict";

module.exports = (panelConfig, moduleConfig, containerInfo, panelBuildStatus, thisStatus) => {
    // we don't need the defaultconfig bit in the panelModule - we we'll just remove it - every byte counts!
    delete moduleConfig.defaultconfig;

    // if containerInfo is null, we'll make it an empty object so we can add calculated fields
    if (!containerInfo) {
        containerInfo = {};
    }

    // remove timestamps from statusItems
    let statusItems = thisStatus?.statusItems ? thisStatus.statusItems : [];
    for (let eachStatusItem of statusItems) {
        delete eachStatusItem.timestamp;
    }

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
        } else if (panelConfig["enabled"]) {
            status = "starting";
        }
    }

    containerInfo._isRunning = isRunning;
    containerInfo._isBuilding = isBuilding;
    containerInfo._isBuilt = isBuilt;
    containerInfo._status = status;

    return {
        id: panelConfig["id"],
        order: panelConfig["order"],
        title: panelConfig["title"],
        group: panelConfig["group"] ? panelConfig["group"] : "",
        description: panelConfig["description"],
        enabled: panelConfig["enabled"],
        module: panelConfig["module"],
        _module: moduleConfig,
        _dockerContainer: containerInfo,
        _buildStatus: panelBuildStatus,
        _status: thisStatus ? thisStatus?.statusItems : [],
    };
};

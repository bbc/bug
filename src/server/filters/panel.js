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

    // check container states
    let isRunning = (containerInfo && containerInfo.state === "running") ?? false;
    let isBuilding = (!isRunning && panelBuildStatus !== null && panelBuildStatus.progress > -1) ?? false;
    let isBuilt = panelBuildStatus !== null ?? false;
    let isStarting = recentlyStarted(containerInfo.status);
    let isRestarting = (containerInfo && containerInfo.state === "restarting") ?? false;

    // now we've used the 'status' field, we get rid of it, to prevent 1-second refreshes in the UI!
    delete containerInfo.status;

    let status = "idle";
    if (!moduleConfig.needsContainer) {
        status = panelConfig["enabled"] ? "active" : "idle";
    } else if (isRestarting) {
        status = "restarting";
    } else if (isStarting) {
        status = "starting";
    } else if (isRunning) {
        status = panelConfig["enabled"] ? "running" : "stopping";
    } else if (isBuilding) {
        status = "building";
    } else if (isBuilt) {
        if (panelBuildStatus.error) {
            status = "error";
        }
    }

    containerInfo._isRunning = isRunning;
    containerInfo._isBuilding = isBuilding;
    containerInfo._isBuilt = isBuilt;
    containerInfo._isRestarting = isRestarting;
    containerInfo._isStarting = isStarting;
    containerInfo._status = status;

    let upgradeable = false;
    if (moduleConfig?.version !== containerInfo?.version && containerInfo?.version !== undefined) {
        upgradeable = true;
    }

    return {
        id: panelConfig["id"],
        title: panelConfig["title"],
        group: panelConfig["group"] ? panelConfig["group"] : "",
        description: panelConfig["description"],
        enabled: panelConfig["enabled"],
        module: panelConfig["module"],
        _module: moduleConfig,
        _dockerContainer: containerInfo,
        _buildStatus: panelBuildStatus,
        _status: thisStatus ? thisStatus?.statusItems : [],
        upgradeable: upgradeable,
        _active: moduleConfig.needsContainer
            ? containerInfo._isRunning && panelConfig["enabled"]
            : panelConfig["enabled"],
    };
};

const recentlyStarted = (status) => {
    if (!status) {
        return false;
    }
    if (status.indexOf("Less than a second") > -1) {
        return true;
    }
    if (status.indexOf(" second") > -1) {
        const statusArray = status.split(" ");
        if (statusArray.length === 3) {
            if (!isNaN(statusArray[1])) {
                if (parseInt(statusArray[1]) < 5) {
                    return true;
                }
            }
        }
    }
    return false;
};

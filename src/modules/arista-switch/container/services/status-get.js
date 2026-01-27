"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckPending = require("@services/status-checkpending");
const statusCheckInterfaceStatus = require("@services/status-checkinterfacestatus");
const statusCheckSfps = require("@services/status-checksfps");
const statusCheckPower = require("@services/status-checkpower");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "interfaces",
            message: ["There is no recent interface information for this device."],
            itemType: "error",
            timeoutSeconds: 1200,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "vlans",
            message: "VLAN information is out of date.",
            itemType: "warning",
            timeoutSeconds: 90,
        }),
        await statusCheckCollection({
            collectionName: "system",
            message: "System information is out of date.",
            itemType: "warning",
            timeoutSeconds: 150,
        }),
        await statusCheckPending(),
        await statusCheckInterfaceStatus(),
        await statusCheckSfps(),
        await statusCheckPower()
    );
};

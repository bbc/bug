"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckPending = require("@services/status-checkpending");
const statusCheckPasswordExpired = require("@services/status-checkpasswordexpired");
const statusGetSystem = require("@services/status-getsystem");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "interfaces",
            message: ["There is no recent interface information for this device."],
            itemType: "error",
            timeoutSeconds: 600,
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
            timeoutSeconds: 600,
        }),
        await statusCheckPending(),
        await statusCheckPasswordExpired(),
        await statusGetSystem()
    );
};

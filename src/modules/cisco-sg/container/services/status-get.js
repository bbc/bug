"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckPending = require("@services/status-checkpending");
const statusCheckPasswordExpired = require("@services/status-checkpasswordexpired");
const statusGetSystem = require("@services/status-getsystem");
const { statusCheckHeartbeat } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckHeartbeat({ timeout: 120 }),
        await statusCheckCollection({
            collectionName: "interfaces",
            message: ["There is no recent interface information for this device."],
            itemType: "warning",
            timeoutSeconds: 1200,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckPending(),
        await statusCheckPasswordExpired(),
        await statusGetSystem()
    );
};

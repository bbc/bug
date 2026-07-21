"use strict";

const { statusCheckHeartbeat } = require("@core/heartbeat");
const statusCheckCollection = require("@core/status-checkcollection");
const statusGetDefault = require("./status-getdefault");

module.exports = async () => {
    return [].concat(
        await statusCheckHeartbeat({ timeout: 10 }),
        await statusCheckCollection({
            collectionName: "leases",
            message: [
                "There is no recent router data for this device.",
            ],
            itemType: "warning",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusGetDefault()
    );
};

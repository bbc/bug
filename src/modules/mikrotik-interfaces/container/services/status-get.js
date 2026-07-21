"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusGetDefault = require("./status-getdefault");
const { statusCheckHeartbeat } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "interfaces",
            message: [
                "There is no recent interface data for this device.",
                "Check your connection and authentication settings.",
            ],
            itemType: "warning",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "traffic",
            message: "There is no recent interface traffic data for this device.",
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckCollection({
            collectionName: "linkstats",
            message: "There is no recent link statistic data for this device.",
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusGetDefault(),
        await statusCheckHeartbeat({ timeout: 10 })
    );
};

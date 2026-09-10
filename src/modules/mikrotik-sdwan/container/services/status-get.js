"use strict";

const { statusCheckHeartbeat } = require("@core/heartbeat");
const statusCheckEntries = require("./status-checkentries");
const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "wanAddresses",
            message: ["There are no WAN addresses defined in the router"],
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckEntries(),
        await statusCheckHeartbeat({ timeout: 10 })
    );
};

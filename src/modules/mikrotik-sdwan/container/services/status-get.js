"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const { statusCheckHeartbeat } = require("@core/heartbeat");
const statusCheckEntries = require("./status-checkentries");
const logger = require("@core/logger")(module);

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "wanAddresses",
            message: ["There are no WAN addresses defined in the router"],
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckEntries(),
        await statusCheckHeartbeat({ timeout: 10 })
    );
};

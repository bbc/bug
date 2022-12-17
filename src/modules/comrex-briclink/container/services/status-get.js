"use strict";

const statusCheckStats = require("@services/status-checkstats");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckStats(),
        await statusCheckMongoSingle({
            collectionName: "peerList",
            message: ["There is no recent information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

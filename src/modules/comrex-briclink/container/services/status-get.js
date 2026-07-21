"use strict";

const statusCheckStats = require("@services/status-checkstats");
const statusGetDefault = require("@services/status-getdefault");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckCodecDb = require("@core/status-checkcodecdb");

module.exports = async () => {
    return [].concat(
        await statusCheckStats(),
        await statusCheckMongoSingle({
            collectionName: "peerList",
            message: ["There is no recent information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusGetDefault(),
        await statusCheckCodecDb(),
    );
};

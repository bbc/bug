"use strict";

const statusCheckPending = require("@services/status-checkpending");
const statusCheckInput = require("@services/status-checkinput");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckCodecDb = require("@core/status-checkcodecdb");

module.exports = async () => {
    return [].concat(
        await statusCheckPending(),
        await statusCheckInput(),
        await statusCheckMongoSingle({
            collectionName: "codecdata",
            message: ["There is no recent codec information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCodecDb(),
    );
};

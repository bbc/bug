"use strict";

const statusCheckPending = require("@services/status-checkpending");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckConnecting = require("@services/status-checkconnecting");
const statusGetDefault = require("@services/status-getdefault");
const statusCheckStreaming = require("@services/status-checkstreaming");

module.exports = async () => {
    return [].concat(
        await statusCheckPending(),
        await statusGetDefault(),
        await statusCheckConnecting(),
        await statusCheckStreaming(),
        await statusCheckMongoSingle({
            collectionName: "settings",
            message: ["There is no recent codec information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

"use strict";

const statusCheckPending = require("@services/status-checkpending");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckPending(),
        await statusCheckMongoSingle({
            collectionName: "settings",
            message: ["There is no recent codec information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

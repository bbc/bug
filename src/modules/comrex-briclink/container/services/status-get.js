"use strict";

// const statusCheckPending = require("@services/status-checkpending");
// const statusCheckInput = require("@services/status-checkinput");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        // await statusCheckPending(),
        // await statusCheckInput(),
        await statusCheckMongoSingle({
            collectionName: "peerList",
            message: ["There is no recent information for this device."],
            itemType: "critical",
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

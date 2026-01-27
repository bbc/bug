"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "vms",
            message: ["There is no recent information for this device."],
            itemType: "error",
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

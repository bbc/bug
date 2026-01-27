"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "leases",
            message: [
                "There is no recent router data for this device.",
                "Check your connection and authentication settings.",
            ],
            itemType: "error",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

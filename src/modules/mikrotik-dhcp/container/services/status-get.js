"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return await statusCheckCollection({
        collectionName: "leases",
        message: [
            "There is no recent router data for this device.",
            "Check your connection and authentication settings.",
        ],
        itemType: "critical",
        timeoutSeconds: 10,
        flags: ["restartPanel", "configurePanel"],
    });
};

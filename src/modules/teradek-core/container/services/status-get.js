"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "token",
            message: [
                "There are no valid tokens for Teradek Core.",
                "Check your authentication settings and user permissions.",
            ],
            itemType: "critical",
            timeoutSeconds: 1209600,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "devices",
            message: "Device information is out of date.",
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckCollection({
            collectionName: "sputniks",
            message: "Sputnik information is out of date.",
            itemType: "warning",
            timeoutSeconds: 120,
        }),
        await statusCheckCollection({
            collectionName: "channels",
            message: "Channel information is out of date.",
            itemType: "warning",
            timeoutSeconds: 120,
        })
    );
};

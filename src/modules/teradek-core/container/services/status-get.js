"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "token",
            message: [
                "There is no tokens for Teradek Core.",
                "Check your authentication settings and user permissions.",
            ],
            itemType: "critical",
            timeoutSeconds: 1000,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "devices",
            message: "There is no devices avalible.",
            itemType: "warning",
            timeoutSeconds: 30,
        })
    );
};

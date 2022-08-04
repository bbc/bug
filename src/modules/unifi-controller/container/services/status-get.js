"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "sites",
            message: ["Could not find any Unifi sites or devices.", "Check your controller settings."],
            itemType: "warning",
            timeoutSeconds: 120,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

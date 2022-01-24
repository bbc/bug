"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "feed",
            message: ["Could not find any items in the RSS feed.", "Check the feed address."],
            itemType: "warning",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

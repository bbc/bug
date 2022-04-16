"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "recevier",
            message: ["Could not find any receiver data.", "Check the IP address and try again."],
            itemType: "warning",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "sources",
            message: ["There are no NDI sources for this device.", "Check the network or discovery server."],
            itemType: "warning",
            timeoutSeconds: 15,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

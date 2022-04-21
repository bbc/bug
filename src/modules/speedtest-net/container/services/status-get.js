"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "test-results",
            message: ["Could not find any Speedtest results.", "Try running a test first."],
            itemType: "warning",
            timeoutSeconds: 24 * 60 * 60,
        })
    );
};

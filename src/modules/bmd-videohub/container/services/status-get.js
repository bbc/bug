"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
// const statusCheckWorkers = require("@core/status-checkworkers");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "data",
            message: "There is no recent router data for this device.\nCheck your connection or address details.",
            itemType: "critical",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

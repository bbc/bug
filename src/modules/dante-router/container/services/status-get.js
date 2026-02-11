"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckAlarms = require("./status-checkalarms");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "domains",
            message: ["There is no recent router data for this device."],
            itemType: "critical",
            timeoutSeconds: 15,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckAlarms()
    );
};

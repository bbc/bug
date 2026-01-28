"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckAlarms = require("./status-checkalarms");
const statusCheckDevice = require("./status-checkdevice");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "data",
            message: ["There is no recent router data for this device.", "Check your connection or address details."],
            itemType: "error",
            timeoutSeconds: 15,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckAlarms(),
        await statusCheckDevice()
    );
};

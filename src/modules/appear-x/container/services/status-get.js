"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckAlarms = require("./status-checkalarms");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "chassisInfo",
            message: ["There is no recent chassis data for this device.", "Check your settings."],
            itemType: "critical",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckAlarms()
    );
};

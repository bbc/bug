"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckAlarms = require("./status-checkalarms");
const statusCheckService = require("./status-checkservices");
const statusCheckConfig = require("@core/status-checkconfig");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "chassisInfo",
            message: ["There is no recent chassis data for this device.", "Check your settings."],
            itemType: "error",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckAlarms(),
        await statusCheckService(),
        await statusCheckConfig()
    );
};

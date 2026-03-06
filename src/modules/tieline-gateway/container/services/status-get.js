"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckLinkQuality = require("@services/status-checklinkquality");
const statusCheckAlarms = require("@services/status-checkalarms");
const statusGetDefault = require("@services/status-getdefault");
const statusGetConnection = require("@services/status-getconnection");
const { getStatus } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "loadedProgram",
            message: ["There is no recent information about the loaded programme."],
            itemType: "critical",
            timeoutSeconds: 1200,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckLinkQuality(),
        await statusCheckAlarms(),
        await getStatus({ timeout: 20 }),
        await statusGetDefault(),
        await statusGetConnection()
    );
};

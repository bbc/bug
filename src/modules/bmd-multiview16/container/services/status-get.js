"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckConfig = require("@core/status-checkconfig");
const statusGetSystem = require("./status-getsystem");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "videohub_device",
            message: ["There is no recent data for this device.", "Check your connection or address details."],
            itemType: "critical",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckConfig(),
        await statusGetSystem()
    );
};

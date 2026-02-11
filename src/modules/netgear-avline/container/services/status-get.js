"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckSystem = require("./status-checksystem");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "interfaces",
            message: ["There is no recent interface information for this device."],
            itemType: "critical",
            timeoutSeconds: 120,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckSystem()
    );
};

"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "interfaces",
            message: ["There is no recent interface information for this device."],
            itemType: "critical",
            timeoutSeconds: 1200,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

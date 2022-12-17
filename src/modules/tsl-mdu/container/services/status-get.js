"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "system",
            message: [
                "There is no recent system data for this device.",
                "Check your connection, model and authentication settings.",
            ],
            itemType: "critical",
            timeoutSeconds: 120,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "outputs",
            message: "There is no recent output data for this device.",
            itemType: "warning",
            timeoutSeconds: 20,
        })
    );
};

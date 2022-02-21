"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "videohub_device",
            message: ["There is no recent data for this device.", "Check your connection or address details."],
            itemType: "critical",
            timeoutSeconds: 15,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "data",
            message: ["There is no recent router data for this device.", "Check your connection or address details."],
            itemType: "critical",
            timeoutSeconds: 3000,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

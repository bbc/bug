"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "devices",
            message: ["Devices information out of date.", "Check device settings."],
            itemType: "warning",
            timeoutSeconds: 60,
        })
    );
};

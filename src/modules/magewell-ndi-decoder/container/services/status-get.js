"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "sources",
            message: ["There are no NDI sources for this device.", "Check the network or discovery server."],
            itemType: "warning",
            timeoutSeconds: 30,
        })
    );
};

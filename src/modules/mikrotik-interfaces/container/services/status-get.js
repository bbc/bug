"use strict";

const statusCheckCollection = require("@core/status-checkcollection");

module.exports = async () => {
    const interfaceResult = await statusCheckCollection({
        collectionName: "interfaces",
        message: [
            "There is no recent interface data for this device.",
            "Check your connection and authentication settings.",
        ],
        itemType: "critical",
        timeoutSeconds: 10,
        flags: ["restartPanel", "configurePanel"],
    });
    if (interfaceResult.length > 0) {
        return interfaceResult;
    }

    return [].concat(
        await statusCheckCollection({
            collectionName: "traffic",
            message: "There is no recent interface traffic data for this device.",
            itemType: "warning",
            timeoutSeconds: 15,
        }),
        await statusCheckCollection({
            collectionName: "linkstats",
            message: "There is no recent link statistic data for this device.",
            itemType: "warning",
            timeoutSeconds: 15,
        })
    );
};

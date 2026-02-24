"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusGetDefault = require("./status-getdefault");

module.exports = async () => {
    return [].concat(
        await statusCheckCollection({
            collectionName: "leases",
            message: [
                "There is no recent router data for this device.",
            ],
            itemType: "critical",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusGetDefault()
    );
};

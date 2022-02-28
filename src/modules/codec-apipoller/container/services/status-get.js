"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "codecs",
            message: ["There is no recent codec data for this device.", "Check your settings."],
            itemType: "critical",
            timeoutSeconds: 10,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "codecs",
            message: ["There is no recent codec data for this service.", "Check your settings."],
            itemType: "error",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};

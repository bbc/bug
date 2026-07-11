"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        return [].concat(
            await statusCheckMongoSingle({
                collectionName: "codecs",
                message: ["There is no recent codec data for this service.", "Check your settings."],
                itemType: "critical",
                timeoutSeconds: 60,
                flags: ["restartPanel", "configurePanel"],
            })
        );
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};

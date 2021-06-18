"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const tarFolder = require("@utils/tar-folder");
const moment = require("moment");

module.exports = async () => {
    try {
        const configFolder = path.join(__dirname, "..", "config");
        const filename = "backup-" + moment().format("DD-MM-YYYY-HH-mm-ss") + ".tgz";
        const stream = await tarFolder(configFolder);

        return {
            stream: stream,
            filename: filename,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system backup`);
    }
};

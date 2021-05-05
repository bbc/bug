"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const tarFolder = require("@utils/tar-folder");
const readDir = require("@utils/read-dir");
const moment = require("moment");

module.exports = async () => {
    try {
        let response = {
            config_folder: path.join(__dirname, "..", "config"),
            data_folder: path.join(__dirname, "..", "data"),
        };

        response.panels = await readDir(response.config_folder);
        response.filename = "backup-" + moment().format("DD-MM-YYYY-HH-mm-ss") + ".tgz";
        response.filepath = path.join(response.data_folder, "backup.tgz");

        await tarFolder(response.config_folder, response.filepath);
    } catch (error) {
        logger.warn(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system backup`);
    }

    return response;
};

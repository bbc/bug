"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const tarFolder = require("@utils/tar-folder");
const getSystemSettings = require("@services/system-settings-get");
const moment = require("moment");

module.exports = async () => {
    try {
        const systemSettings = await getSystemSettings();
        let title = systemSettings.data?.title;

        if (title) {
            //Santize the title so it can be used as a filename
            title = title.toLowerCase();
            title = title.replace(/[/\\?%*:|"<>]/g, "_");
            title = title.replace(" ", "-");
        } else {
            title = "";
        }

        const configFolder = path.join(__dirname, "..", "config");
        const filename = `${title}-backup-${moment().format("DD-MM-YYYY-HH-mm-ss")}.tgz`;
        const stream = await tarFolder(configFolder, ["panels", "global"]);

        return {
            stream: stream,
            filename: filename,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system backup`);
    }
};

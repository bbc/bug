"use strict";

const path = require("path");
const { format } = require("date-fns");
const logger = require("@utils/logger")(module);
const tarFolder = require("@utils/tar-folder");
const getSystemSettings = require("@services/system-settings-get");

module.exports = async () => {
    try {
        const systemSettings = await getSystemSettings();
        let title = systemSettings.data?.title;

        if (title) {
            // Sanitize the title so it can be used as a filename
            title = title.toLowerCase();
            title = title.replace(/[/\\?%*:|"<>]/g, "_");
            title = title.replace(" ", "-");
        } else {
            title = "";
        }

        const configFolder = path.join(__dirname, "..", "config");
        const filename = `${title}-backup-${format(new Date(), "dd-MM-yyyy-HH-mm-ss")}.tgz`;
        const stream = await tarFolder(configFolder, ["panels", "global"]);

        return {
            stream,
            filename,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system backup`);
    }
};

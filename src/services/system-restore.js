"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const untarFolder = require("@utils/untar-folder");

module.exports = async (backup) => {
    try {
        let status;
        const absolutePath = path.join(__dirname, "..", backup?.tempFilePath);
        logger.info(`Backup file called "${backup?.name}" with a size of ${backup?.size} bytes uploaded.`);

        if (backup?.mimetype === "application/gzip") {
            status = await untarFolder(absolutePath, path.join(__dirname, "..", "data"));
        }

        return {
            status: status ? "success" : "failure",
            message: "Restored settings from file",
            data: null,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system restore`);
    }
};

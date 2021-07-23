"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const untarFolder = require("@utils/untar-folder");
const fs = require("fs-extra");
const delay = require("delay");

module.exports = async (backup) => {
    try {
        let status;
        const absolutePath = path.join(__dirname, "..", backup?.tempFilePath);
        const extractPath = path.join(__dirname, "..", "data");
        const configFolder = path.join(__dirname, "..", "config");
        const configFolders = ["panels", "global"];

        logger.info(`Backup file called "${backup?.name}" with a size of ${backup?.size} bytes uploaded.`);

        if (backup?.mimetype === "application/gzip") {
            status = await untarFolder(absolutePath, extractPath);
        }

        await delay(1000);

        for (let folder of configFolders) {
            status = await fs.move(path.join(extractPath, folder), path.join(configFolder, folder), {
                overwrite: true,
            });
        }

        await delay(1000);

        return {
            status: status ? "failure" : "success",
            message: "Restored settings from file",
            data: null,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to complete system restore`);
    }
};

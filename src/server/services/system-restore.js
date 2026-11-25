"use strict";

const path = require("path");
const logger = require("@core/logger")(module);
const restoreConfig = require("@utils/restore-config");

module.exports = async (backup) => {
    try {
        if (typeof backup?.tempFilePath !== "string" || !backup.tempFilePath) {
            throw new Error("Backup upload is missing a temporary file");
        }

        const root = path.join(__dirname, "..", "..", "..");
        logger.info(`backup file "${backup.name}" with a size of ${backup.size} bytes uploaded`);
        await restoreConfig(
            path.resolve(root, backup.tempFilePath),
            path.join(root, "config"),
            path.join(root, "data")
        );
        return {
            status: "success",
            message: "Restored settings from file",
            data: "Restored settings from file",
        };
    } catch (error) {
        logger.error(`${error.stack}`);
        if (error.code === "RESTORE_IN_PROGRESS" || error.code === "RESTORE_ROLLBACK_INCOMPLETE") {
            throw error;
        }
        throw new Error("Failed to complete system restore", { cause: error });
    }
};

"use strict";

const path = require("path");
const fs = require("fs-extra");
const logger = require("@core/logger")(module);
const untarFolder = require("@utils/untar-folder");

let restoring = false;

const validateJsonFiles = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            await validateJsonFiles(filename);
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
            try {
                JSON.parse(await fs.readFile(filename, "utf8"));
            } catch (error) {
                throw new Error(`Invalid configuration file: ${filename}`, { cause: error });
            }
        }
    }
};

module.exports = async (archivePath, configFolder, dataFolder) => {
    if (restoring) {
        const error = new Error("A restore is already in progress");
        error.code = "RESTORE_IN_PROGRESS";
        throw error;
    }
    restoring = true;

    let workspace;
    let keepWorkspace = false;
    try {
        await fs.ensureDir(dataFolder);
        workspace = await fs.mkdtemp(path.join(dataFolder, "restore-"));
        const extracted = path.join(workspace, "extracted");
        const recovery = path.join(workspace, "recovery");
        const folders = ["panels", "global"];
        await fs.ensureDir(extracted);
        await untarFolder(archivePath, extracted);

        for (const folder of folders) {
            const stat = await fs.lstat(path.join(extracted, folder));
            if (!stat.isDirectory()) {
                throw new Error(`Backup is missing the ${folder} directory`);
            }
            await validateJsonFiles(path.join(extracted, folder));
        }

        const existing = {};
        for (const folder of folders) {
            const destination = path.join(configFolder, folder);
            existing[folder] = await fs.pathExists(destination);
            if (existing[folder]) {
                const stat = await fs.lstat(destination);
                if (!stat.isDirectory()) {
                    throw new Error(`Configuration path is not a directory: ${destination}`);
                }
                await fs.copy(destination, path.join(recovery, folder));
            }
        }

        const attempted = [];
        try {
            for (const folder of folders) {
                const destination = path.join(configFolder, folder);
                attempted.push(folder);
                await fs.emptyDir(destination);
                await fs.copy(path.join(extracted, folder), destination);
            }
        } catch (error) {
            const rollbackErrors = [];
            for (const folder of attempted.reverse()) {
                const destination = path.join(configFolder, folder);
                try {
                    if (existing[folder]) {
                        await fs.emptyDir(destination);
                        await fs.copy(path.join(recovery, folder), destination);
                    } else {
                        await fs.remove(destination);
                    }
                } catch (rollbackError) {
                    rollbackErrors.push(`${folder}: ${rollbackError.message}`);
                }
            }
            if (rollbackErrors.length) {
                keepWorkspace = true;
                logger.error(`Restore rollback failed: ${rollbackErrors.join("; ")}. Recovery files: ${recovery}`);
                const rollbackError = new Error(
                    `Restore failed and rollback was incomplete. Recovery files: ${recovery}`,
                    {
                        cause: error,
                    }
                );
                rollbackError.code = "RESTORE_ROLLBACK_INCOMPLETE";
                throw rollbackError;
            }
            throw error;
        }
    } finally {
        try {
            if (workspace && !keepWorkspace) {
                await fs.remove(workspace);
            }
        } catch (error) {
            logger.warning(`Could not remove restore temporary files at ${workspace}: ${error.stack}`);
        } finally {
            restoring = false;
        }
    }
};

"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const readJson = require("@core/read-json");
const updateVersion = require("@services/system-update-version");
const systemIp = require("@services/system-ip");
const systemUptime = require("@services/system-uptime");
const systemGitInfo = require("@services/system-git-info");

const filename = path.join(__dirname, "..", "package.json");

async function getPackage() {
    try {
        return await readJson(filename);
    } catch (error) {
        throw error;
    }
}

module.exports = async () => {
    try {
        const NpmPackage = await getPackage();
        const updates = await updateVersion();

        const response = {
            data: {
                ip: await systemIp(),
                uptime: await systemUptime(),
                git: await systemGitInfo(),
                version: NpmPackage?.version,
                updates: updates,
            },
        };
        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve global bug settings.`);
    }
};

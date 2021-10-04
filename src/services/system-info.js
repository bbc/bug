"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const readJson = require("@core/read-json");
const avalibleversion = require("@services/system-avalibleversion");

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
        const response = {
            data: {
                version: NpmPackage?.version,
                avalibleVersion: await avalibleversion(),
            },
        };
        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve global bug settings.`);
    }
};

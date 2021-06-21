"use strict";

//TODO error handling with throw

const { promises: fs } = require("fs");
const logger = require("@utils/logger")(module);
const path = require("path");
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const deleteFile = require("@core/delete-file");
const cacheStore = require("@core/cache-store");

function clearCache() {
    const cacheKey = "panelConfig";
    cacheStore.del(cacheKey);
}

exports.get = async function (panelId) {
    try {
        const filename = path.join(
            __dirname,
            "..",
            "config",
            "panels",
            `${panelId}.json`
        );
        return await readJson(filename);
    } catch (error) {
        logger.warning(
            `panel id ${panelId} - ${
                error.stack || error.trace || error || error.message
            }`
        );
    }
};

exports.set = async function (panelConfig) {
    try {
        const filename = path.join(
            __dirname,
            "..",
            "config",
            "panels",
            `${panelConfig.id}.json`
        );
        clearCache();
        return await writeJson(filename, panelConfig);
    } catch (error) {
        logger.warning(
            `panel id ${panelConfig.id} - ${
                error.trace || error || error.message
            }`
        );
        return false;
    }
};

exports.delete = async function (panelId) {
    try {
        const filename = path.join(
            __dirname,
            "..",
            "config",
            "panels",
            `${panelId}.json`
        );
        clearCache();
        logger.debug(`deleting file ${filename}`);
        return await deleteFile(filename);
    } catch (error) {
        logger.warning(
            `panel id ${panelConfig.id} - ${
                error.stack || error.trace || error || error.message
            }`
        );
        return false;
    }
};

exports.list = async function (panelId) {
    const cacheKey = "panelConfig";
    const configFolder = path.join(__dirname, "..", "config", "panels");

    // check the cache first
    let panelArray = cacheStore.get(cacheKey);
    if (!panelArray) {
        panelArray = [];

        let files;
        try {
            files = await fs.readdir(configFolder);
        } catch (error) {
            logger.warning(`${error.trace || error || error.message}`);
        }

        for (let i in files) {
            try {
                const filename = path.join(configFolder, files[i]);
                if (filename.endsWith(".json")) {
                    const panelFile = await readJson(filename);
                    if (panelFile) {
                        panelArray.push(panelFile);
                    }
                }
            } catch (error) {
                logger.warning(
                    `filename ${filename} - ${
                        error.stack || error.trace || error || error.message
                    }`
                );
            }
        }
        // cache the result for 1 minute
        cacheStore.set(cacheKey, panelArray, 60);
    }

    return panelArray;
};

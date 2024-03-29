"use strict";

//TODO error handling with throw

const { promises: fs } = require("fs");
const logger = require("@utils/logger")(module);
const path = require("path");
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const deleteFile = require("@core/delete-file");

exports.get = async function (panelId) {
    try {
        const filename = path.join(__dirname, "..", "config", "panels", `${panelId}.json`);
        return await readJson(filename);
    } catch (error) {
        logger.warning(`panel id ${panelId} - ${error.stack || error.trace || error || error.message}`);
    }
};

exports.getChangedDate = async function (panelId) {
    try {
        const filename = path.join(__dirname, "..", "config", "panels", `${panelId}.json`);
        const stats = await fs.stat(filename);
        return stats.mtime;
    } catch (error) {
        logger.warning(`panel id ${panelId} - ${error.stack || error.trace || error || error.message}`);
    }
};

exports.set = async function (panelConfig) {
    try {
        const filename = path.join(__dirname, "..", "config", "panels", `${panelConfig.id}.json`);
        return await writeJson(filename, panelConfig);
    } catch (error) {
        logger.warning(`panel id ${panelConfig.id} - ${error.trace || error || error.message}`);
        return false;
    }
};

exports.delete = async function (panelId) {
    try {
        const filename = path.join(__dirname, "..", "config", "panels", `${panelId}.json`);
        logger.debug(`deleting file ${filename}`);
        return await deleteFile(filename);
    } catch (error) {
        logger.warning(`panel id ${panelConfig.id} - ${error.stack || error.trace || error || error.message}`);
        return false;
    }
};

exports.list = async function () {
    const configFolder = path.join(__dirname, "..", "config", "panels");

    const panelArray = [];

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
            logger.warning(`${error.stack || error.trace || error || error.message}`);
        }
    }

    return panelArray;
};

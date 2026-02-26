"use strict";

const { promises: fs } = require("fs");
const logger = require("@core/logger")(module);
const path = require("path");
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const deleteFile = require("@core/delete-file");

const PANELS_DIR = path.join(__dirname, "..", "..", "..", "config", "panels");

function panelFilename(panelId) {
    return path.join(PANELS_DIR, `${panelId}.json`);
}

exports.get = async function (panelId) {
    try {
        return await readJson(panelFilename(panelId));
    } catch (err) {
        err.message = `panel-get: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.getChangedDate = async function (panelId) {
    try {
        const stats = await fs.stat(panelFilename(panelId));
        return stats.mtime;
    } catch (err) {
        err.message = `panel-getChangedDate: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.set = async function (panelConfig) {
    try {
        return await writeJson(panelFilename(panelConfig.id), panelConfig);
    } catch (err) {
        err.message = `panel-set: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.delete = async function (panelId) {
    try {
        const filename = panelFilename(panelId);
        logger.debug(`deleting file ${filename}`);
        return await deleteFile(filename);
    } catch (err) {
        err.message = `panel-delete: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.list = async function () {
    try {
        const files = await fs.readdir(PANELS_DIR);
        const panelFiles = files.filter(file => file.endsWith(".json"));

        const panels = await Promise.all(
            panelFiles.map(file =>
                readJson(path.join(PANELS_DIR, file))
            )
        );

        return panels.filter(Boolean);
    } catch (err) {
        err.message = `panel-list: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};
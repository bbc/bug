"use strict";

const logger = require("@core/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const global = require("@utils/globalEmitter");

const filename = path.join(__dirname, "..", "..", "..", "config", "global", "settings.json");
const defaultFilename = path.join(__dirname, "..", "..", "..", "config", "default", "settings.json");

async function getSettings() {
    try {
        return await readJson(filename);
    } catch (err) {
        try {
            const contents = await readJson(defaultFilename);
            await writeJson(filename, contents);
            return contents;
        } catch (writeErr) {
            writeErr.message = `settings-getSettings: ${writeErr.message}`;
            logger.error(writeErr.stack || writeErr.message);
            throw writeErr;
        }
    }
}

exports.get = async function () {
    try {
        return await getSettings();
    } catch (err) {
        err.message = `settings-get: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.update = async function (newSettings) {
    try {
        const settings = await getSettings();
        const mergedSettings = { ...settings, ...newSettings };

        global.emit("settings", mergedSettings);

        return await writeJson(filename, mergedSettings);
    } catch (err) {
        err.message = `settings-update: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};
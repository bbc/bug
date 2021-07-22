"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const hash = require("@utils/hash");

const filename = path.join(__dirname, "..", "config", "global", "settings.json");

const defaultFilename = path.join(__dirname, "..", "config", "default", "settings.json");

async function getSettings() {
    try {
        return await readJson(filename);
    } catch (error) {
        const contents = await readJson(defaultFilename);
        if (await writeJson(filename, contents)) {
            return contents;
        }
        throw error;
    }
}

exports.get = async function () {
    try {
        const settings = await getSettings();
        return settings;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.update = async function (newSettings) {
    try {
        const settings = await getSettings();
        return await writeJson(filename, { ...settings, ...newSettings });
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

"use strict";

/**
 * core/write-json.js
 * Encodes object as JSON and writes it to disk
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { promises: fs } = require("fs");
const path = require("path");

async function ensureDirectoryExists(filepath) {
    const dirname = path.dirname(filepath);
    await fs.mkdir(dirname, { recursive: true });
}

module.exports = async (filepath, contents) => {
    try {
        await ensureDirectoryExists(filepath);
        const jsonString = await JSON.stringify(contents, null, 2);
        await fs.writeFile(filepath, jsonString);
        return true;
    } catch {
        return false;
    }
};

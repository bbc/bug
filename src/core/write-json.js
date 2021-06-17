"use strict";

/**
 * core/write-json.js
 * Encodes object as JSON and writes it to disk
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { promises: fs } = require("fs");

module.exports = async (filepath, contents) => {
    try {
        const jsonString = await JSON.stringify(contents, null, 2);
        await fs.writeFile(filepath, jsonString);
        return true;
    } catch {
        return false;
    }
};

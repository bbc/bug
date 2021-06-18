"use strict";

/**
 * core/read-json.js
 * Fetches a file from disk and decodes as JSON
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { promises: fs } = require("fs");

module.exports = async (filename) => {
    const fileJson = await fs.readFile(filename);
    return JSON.parse(fileJson);
};

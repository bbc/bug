"use strict";

/**
 * core/write-json.js
 * Encodes object as JSON and writes it to disk
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const fs = require("fs").promises;

module.exports = async (filepath, contents) => {
    const jsonString = await JSON.stringify(contents, null, 2);
    await fs.writeFile(filepath, jsonString);
};

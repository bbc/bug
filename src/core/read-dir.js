"use strict";

/**
 * core/read-dir.js
 * Fetches a list of files (and total count) from the specified folder
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const fs = require("fs");

module.exports = async (directory) => {
    const contents = {};
    contents.files = await fs.promises.readdir(directory)
    contents.count = contents.files.length;
    return contents;
};

"use strict";

/**
 * core/config-get.js
 * Fetches config from container file and returns decoded JSON
 * 0.0.1 17/05/2021 - Created first version (GH)
 * 0.0.2 17/05/2021 - Added 'return null' when file doesn't exist
 */

const readJson = require("@core/read-json");
const path = require("path");
module.exports = async () => {
    try {
        const filename = path.join(__dirname, "..", "config", "panel.json");
        return await readJson(filename);
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        console.log(`config-get: ${error.stack || error.trace || error || error.message}`);
    }
    return null;
};

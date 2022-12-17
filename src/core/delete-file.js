"use strict";

/**
 * core/delete-file.js
 * Deletes the specified file
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { promises: fs } = require("fs");

module.exports = async (filename) => {
    try {
        await fs.unlink(filename);
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return false;
    }
    return true;
};

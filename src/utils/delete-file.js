'use strict';

//TODO error handling with throw

const fs = require('fs').promises;

module.exports = async (filename) => {
    try {
        await fs.unlink(filename);
    } catch (error) {
        logger.warn(`${error.stack || error.trace || error || error.message}`);
        return false;
    }
    return true;
}
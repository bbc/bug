'use strict';

/**
 * core/config-get.js
 * Fetches config from container file and returns decoded JSON
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const readJson = require('@core/read-json');
const path = require('path');
module.exports = async () => {

    try {
        const filename = path.join(__dirname, '..', 'config', 'panel.json');
        return await readJson(filename);
    } catch (error) {
        console.log(`config-get: ${error.trace || error || error.message}`);
    }

    return null;
}

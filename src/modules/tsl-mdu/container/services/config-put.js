'use strict';

const writeJson = require('../utils/write-json');
const path = require('path');

module.exports = async (config) => {
    try {
        const filename = path.join(__dirname, '..', 'config', 'panel.json');
        return await writeJson(filename, config);
    } catch (error) {
        console.log(`config-put: ${error.trace || error || error.message}`);
    }

    return null;
}

'use strict';

const readJson = require('../utils/read-json');
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

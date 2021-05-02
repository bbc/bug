'use strict';

const writeJson = require('../utils/write-json');
const path = require('path');

module.exports = async (config) => {
    //TODO decide if container needs a restart
    try {
        const filename = path.join(__dirname, '..', 'config', 'panel.json');
        await writeJson(filename, config);
        console.log(`config-put: saved config file to ${filename}`);
        return true;
    } catch (error) {
        console.log(`config-put: ${error.trace || error || error.message}`);
    }

    return false;
}

'use strict';

const writeJson = require('../utils/write-json');
const workerManager = require('../api/workers');
const path = require('path');

module.exports = async (config) => {
    try {
        console.log(`config-put: received config update`);
        const filename = path.join(__dirname, '..', 'config', 'panel.json');
        await writeJson(filename, config);
        console.log(`config-put: saved config file to ${filename}`);

        //Tell the worker manager that a new config is avalible
        await workerManager.pushConfig(config);

        return true;
    } catch (error) {
        console.log(`config-put: ${error.trace || error || error.message}`);
    }

    return false;
}

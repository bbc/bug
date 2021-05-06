'use strict';

const fs = require('fs')
const util = require('util');
const readdir = util.promisify(fs.readdir);
const logger = require('@utils/logger')(module);
const readJson = require('@utils/read-json');
const path = require('path');

module.exports = async function() {

    //TODO cache
    try {
        var files = await readdir('config');
    } catch (error) {
        throw new Error(`Failed to read files in folder 'config'`);
    }

    var response = [];
    for(var i in files) {
        try {
            let filename = path.join('config', files[i]);
            var panelFile = await readJson(filename);
            if(panelFile) {
                response.push(panelFile);
            }
        } catch (error) {
            logger.warning(`${error.stack || error.trace || error || error.message}`);
            throw new Error(`Failed to list panel config`);
        }
    }
    return response;
}
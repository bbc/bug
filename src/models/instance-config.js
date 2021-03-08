'use strict';

const fs = require('fs')
const util = require('util');
const readfile = util.promisify(fs.readFile);
const logger = require('@utils/logger');
const readJson = require('@utils/read-json');

exports.get = async function(instanceId) {
    try {
        return await readJson(`config/${instanceId}.json`);
    } catch (error) {
        logger.warn(`globalconfig: ${error.trace || error || error.message}`);
    }
}

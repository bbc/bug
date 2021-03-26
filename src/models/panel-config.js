'use strict';

const fs = require('fs')
const util = require('util');
const readdir = util.promisify(fs.readdir);
const logger = require('@utils/logger');
const readJson = require('@utils/read-json');
const path = require('path');
const writeJson = require('@utils/write-json');

exports.get = async function(panelId) {
    try {
        return await readJson(`config/${panelId}.json`);
    } catch (error) {
        logger.warn(`panel-config: ${error.trace || error || error.message}`);
    }
}

exports.set = async function(panelConfig) {

    try {
        let path = path.join(__dirname,'..','config',panelConfig.id)
        return writeJson(path,panelConfig);
    } 
    catch (error) {
        logger.warn(`panel-config: ${error.trace || error || error.message}`);
        return false;
    }
}

exports.list = async function(panelId) {

    //TODO cache
    try {
        var files = await readdir('config');
    } catch (error) {
        logger.warn(`panel-config: ${error.trace || error || error.message}`);
    }

    var panelArray = [];
    for(var i in files) {
        try {
            let filename = path.join('config', files[i]);
            var panelFile = await readJson(filename);
            if(panelFile) {
                panelArray.push(panelFile);
            }
        } catch (error) {
            logger.warn(`panel-config: ${error.trace || error || error.message}`);
        }
    }
    return panelArray;
}
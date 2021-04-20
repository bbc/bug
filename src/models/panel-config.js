'use strict';

const fs = require('fs')
const util = require('util');
const readdir = util.promisify(fs.readdir);
const logger = require('@utils/logger');
const path = require('path');
const readJson = require('@utils/read-json');
const writeJson = require('@utils/write-json');
const deleteFile = require('@utils/delete-file');

exports.get = async function(panelId) {
    try {
        return await readJson(`config/${panelId}.json`);
    } catch (error) {
        logger.warn(`panel-config: panel id ${panelId} - ${error.trace || error || error.message}`);
    }
}

exports.set = async function(panelConfig) {

    try {
        const filename = path.join(__dirname, '..', 'config', panelConfig.id);
        return writeJson(filename, panelConfig);
    } 
    catch (error) {
        logger.warn(`panel-config: panel id ${panelConfig.id} - ${error.trace || error || error.message}`);
        return false;
    }
}

exports.delete = async function(panelId) {

    try {
        const filename = path.join(__dirname, '..', 'config',`${panelId}.json`);
        return deleteFile(filename);
    } 
    catch (error) {
        logger.warn(`panel-config: panel id ${panelConfig.id} - ${error.trace || error || error.message}`);
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
            const filename = path.join('config', files[i]);
            if(filename.endsWith('.json')) {
                const panelFile = await readJson(filename);
                if(panelFile) {
                    panelArray.push(panelFile);
                }
            }
        } catch (error) {
            logger.warn(`panel-config: filename ${filename} - ${error.trace || error || error.message}`);
        }
    }
    return panelArray;
}
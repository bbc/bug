'use strict';

//TODO error handling with throw

const fs = require('fs')
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const logger = require('@utils/logger')(module);
const readJson = require('@utils/read-json');
const modulesFolder = "modules";

exports.list = async function() {

    //TODO cache for life of application

    try {
        var files = await readdir(modulesFolder);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }

    var moduleArray = [];
    for(var i in files) {
        try {
            let filename = path.join(modulesFolder, files[i], 'module.json');
            var packageFile = await readJson(filename);
            if(!packageFile) {
                logger.warning(`file '${filename}' not found`);
                return null
            }
            moduleArray.push(packageFile);
        } catch (error) {
            logger.warning(`${error.trace || error || error.message}`);
        }
    }
    return moduleArray;
}

exports.get = async function(moduleName) {
    //TODO - just get the file!
    try {
        var moduleList = await exports.list();
        for(var i in moduleList) {
            if(moduleList[i]['name'] === moduleName) {
                return moduleList[i];
            }
        }

    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }

    return null;
}
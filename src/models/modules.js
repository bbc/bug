'use strict';

const fs = require('fs')
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const logger = require('@utils/logger');
const readJson = require('@utils/read-json');

exports.listInfo = async function() {

    const modulesFolder = "modules";

    try {
        var files = await readdir(modulesFolder);
    } catch (error) {
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }

    var moduleArray = [];
    for(var i in files) {
        try {
            let filename = path.join(modulesFolder, files[i], 'package.json');
            var packageFile = await readJson(filename);
            if(packageFile) {
                moduleArray.push({
                    name: packageFile['name'] ?? '',
                    longname: packageFile['longname'] ?? '',
                    version: packageFile['version'] ?? '',
                    description: packageFile['description'] ?? '',
                    author: packageFile['author'] ?? '',
                    icon: packageFile['icon'] ?? '',
                    path: path.join(modulesFolder, files[i])
                });
            }
        } catch (error) {
            logger.warn(`module-list: ${error.trace || error || error.message}`);
        }
    }

    return moduleArray;
}
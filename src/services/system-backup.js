'use strict';

const path = require('path');
const logger = require('@utils/logger');
const tarFolder = require('@utils/tar-folder');
const readDir = require('@utils/read-dir');
const moment = require('moment');

module.exports = async () => {

    let response = {
        config_folder: path.join(__dirname,'..','config'),
        data_folder: path.join(__dirname,'..','data'),
    }

    try {

        response.panels = await readDir(response.config_folder)

        response.filename = 'backup-'+moment().format('DD-MM-YYYY-HH-mm-ss')+'.tgz';
        response.filepath = path.join(response.data_folder,response.filename)

        await tarFolder(response.config_folder,'backup.tgz')
       
    } catch (error) {
        response.error = error
        logger.warn(__filename +': '+error);
    }

    return response

}
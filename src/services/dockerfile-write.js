'use strict';

const fs = require('fs')
const path = require('path')
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const nodeEnv = process.env.NODE_ENV || 'production';
const readfile = util.promisify(fs.readFile);
const logger = require('@utils/logger');

module.exports = async (filepath) => {

    try {
            
        const filename = path.join(filepath,'Dockerfile');
        const fileArray = ['FROM node:14',
                            'WORKDIR ' + process.env.MODULE_HOME,
                            'COPY . .',
                            'RUN npm install',
                            'CMD ["npm","run","' + nodeEnv + '"]']

        const newFile = fileArray.join('\n');

        // check if any difference
        let existingFile = null;
        try {
            existingFile = await readfile(filename);
        } catch (error) {}

        if(existingFile != newFile) {
            logger.info(`dockerfile-write: writing dockerfile ${filename}`);
            await writeFile(filename, newFile);
        }
    } catch (error) {
        logger.warn(`dockerfile-write: ${error.trace || error || error.message}`);
        return false;
    }
    return true;
}
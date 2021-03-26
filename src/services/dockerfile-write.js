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
                            'WORKDIR /home/node/module',
                            'COPY . .',
                            'RUN npm install',
                            'CMD ["npm","run","'+nodeEnv+'"]']

        const newFile = fileArray.join('\n');

        // check if any difference
        const existingFile = await readfile(filename);

        if(existingFile != newFile) {
            logger.info(`dockerfile-write: writing dockerfile ${filename}`);
            await writeFile(filename, newFile);
        }
    } catch (error) {
        return false;
    }
    return true;
}
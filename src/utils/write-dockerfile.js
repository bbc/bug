'use strict';

const fs = require('fs')
const path = require('path')
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = async (filepath) => {

    let dockerfile = ['FROM node:14',
                        'WORKDIR /home/node/module',
                        'COPY . .',
                        'RUN npm install',
                        'CMD ["npm","run","'+nodeEnv+'"]']

    writeFile(path.join(filepath,'Dockerfile'), dockerfile.join('\n'));
}
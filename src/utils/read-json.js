'use strict';

const fs = require('fs')
const util = require('util');
const readfile = util.promisify(fs.readFile);

module.exports = async (filepath) => {
    const fileJson = await readfile(filepath);
    return JSON.parse(fileJson);
}



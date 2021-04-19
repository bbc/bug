'use strict';

const fs = require('fs')
const util = require('util');
const readfile = util.promisify(fs.readFile);

module.exports = async (filename) => {
    let fileJson = await readfile(filename);
    return JSON.parse(fileJson);
}



'use strict';

const fs = require('fs')
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

module.exports = async (filepath,contents) => {
    filepath = filepath + '.json';
    const jsonString = await JSON.stringify(contents, null, 2);
    writeFile(filepath, jsonString);
}
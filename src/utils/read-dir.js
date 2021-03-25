'use strict';

const fs = require('fs')
const util = require('util');
const readDir = util.promisify(fs.readdir);
const path = require('path');

module.exports = async (directory) => {
    let contents = {}
    contents.files = await readDir(directory)
    contents.count = contents.files.length
    return contents
}

'use strict';

const fs = require('fs')
const util = require('util');
const deleteFile = util.promisify(fs.unlinkSync);

module.exports = async (filename) => {
    const state = await deleteFile(filename);
    return state;
}
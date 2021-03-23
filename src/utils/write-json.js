'use strict';

const fs = require('fs')
const util = require('util');

module.exports = async (filepath,contents) => {

    filepath = filepath + 'json'
    const jsonString = JSON.stringify(contents)
    await fs.writeFile(filepath, jsonString)

}
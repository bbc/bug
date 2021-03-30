'use strict';

const fs = require('fs').promises

module.exports = async (filepath,contents) => {
    filepath = filepath + '.json';
    const jsonString = await JSON.stringify(contents, null, 2);
    await fs.writeFile(filepath, jsonString);
}
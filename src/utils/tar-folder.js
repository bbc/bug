'use strict';

const fs = require('fs')
const tar = require('tar')

module.exports = async (inputFolderPath,outputFilePath) => {
    
    await tar.c({gzip: true},[inputFolderPath]).pipe(await fs.createWriteStream(outputFilePath));

    return outputFilePath
}
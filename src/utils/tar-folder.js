'use strict';

const fs = require('fs')
const tar = require('tar')

//TODO error handling with throw

module.exports = async (inputFolderPath,outputFilePath) => {
    
    const stream = await tar.create({gzip: true},[inputFolderPath]);
    await sreaam.pipe(await fs.createWriteStream(outputFilePath));
    
    return outputFilePath
}
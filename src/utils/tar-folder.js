'use strict';

const fs = require('fs')
const tar = require('tar')

//TODO error handling with throw

module.exports = async (inputFolderPath) => {
    const stream = await tar.create({gzip: true},[inputFolderPath]);
    return stream;
}
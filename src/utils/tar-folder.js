"use strict";

const tar = require("tar");

module.exports = async (inputFolderPath, subFolders) => {
    try {
        const stream = await tar.create({ gzip: true, C: inputFolderPath }, subFolders);
        return stream;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to tar the folder`);
    }
};

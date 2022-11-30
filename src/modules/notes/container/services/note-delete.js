"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (noteId) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.notes[noteId]) {
        return false;
    }

    delete config.notes[noteId];

    return await configPutViaCore(config);
};

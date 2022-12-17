"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (noteId, newNote) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.notes[noteId]) {
        return false;
    }

    config.notes[noteId] = { ...config.notes[noteId], ...newNote, ...{ lastUpdated: new Date() } };
    return await configPutViaCore(config);
};

"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (note) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    const noteId = await uuidv4();
    config.notes[noteId] = { ...note, ...{ created: new Date() } };

    return await configPutViaCore(config);
};

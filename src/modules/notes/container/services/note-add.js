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
    config.notes[noteId] = {
        ...note,
        ...{
            created: new Date(),
            data: `{"blocks":[{"key":"5hvev","text":"New Note ${
                Object.keys(config?.notes).length + 1
            }","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        },
    };

    return await configPutViaCore(config);
};

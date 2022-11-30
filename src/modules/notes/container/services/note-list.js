"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();

        const notesArray = [];

        for (let noteId in config?.notes) {
            notesArray.push(config?.notes[noteId]);
        }

        return await notesArray;
    } catch (error) {
        return [];
    }
};

"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();

        const notesArray = [];

        for (let noteId in config?.notes) {
            notesArray.push(config?.notes[noteId]);
        }

        return notesArray.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    } catch (error) {
        return [];
    }
};

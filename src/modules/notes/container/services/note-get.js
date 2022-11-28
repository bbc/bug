"use strict";

const configGet = require("@core/config-get");

module.exports = async (noteId) => {
    try {
        const config = await configGet();
        return config.notes[noteId];
    } catch (error) {
        return [];
    }
};

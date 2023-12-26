"use strict";

const mongoSingle = require("@core/mongo-single");
const getConfig = require("@core/config-get");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const config = await getConfig();
    const cueList = await mongoSingle.get("cueList");

    const consoleList = await mongoSingle.get("consoleList");
    return consoleList.map((c) => {
        const matchingCue = cueList.find((cl) => cl.number === c.cue);
        return {
            ...c,
            _cueName: matchingCue?.name,
            name: `Playback ${c.number}`,
            alias: config?.playbackAliases?.[c.number],
        };
    });
};

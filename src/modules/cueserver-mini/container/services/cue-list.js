"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const consoleList = await mongoSingle.get("consoleList");

    const cueList = await mongoSingle.get("cueList");

    const sortHandlerList = {
        number: sortHandlers.number,
        name: sortHandlers.string,
    };

    if (!cueList) {
        return [];
    }

    // add playback statuses
    const cueListWithPlaybacks = cueList.map((c) => {
        const matchingPlaybacks = consoleList.filter((cl) => cl.cue === c.number).map((cl) => cl.number);
        return {
            ...c,
            playbacks: matchingPlaybacks,
        };
    });

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            cueListWithPlaybacks.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            cueListWithPlaybacks.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    return cueListWithPlaybacks;
};

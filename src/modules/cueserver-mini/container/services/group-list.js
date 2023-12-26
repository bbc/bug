"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const groupList = await mongoSingle.get("groupList");

    const sortHandlerList = {
        number: sortHandlers.number,
        name: sortHandlers.string,
    };

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            groupList.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            groupList.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    return groupList;
};

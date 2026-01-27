"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    try {
        let users = await userModel.list();

        for (const eachFilter of Object.keys(filters)) {
            users.filter((user) => user[eachFilter].includes(filters[eachFilter]));
        }

        const sortHandlerList = {
            username: sortHandlers.string,
            name: sortHandlers.string,
            email: sortHandlers.number,
        };

        // sort
        if (sortField && sortHandlerList[sortField]) {
            if (sortDirection === "asc") {
                users.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
            } else {
                users.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
            }
        }

        return users;
    } catch (error) {
        logger.error(`user-list: ${error.stack}`);
        throw new Error(`Failed to retrieve users`);
    }
};

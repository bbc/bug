"use strict";

const mongoSingle = require('@core/mongo-single');
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    try {
        let dbLeases = await mongoSingle.get('dhcpLeases');

        // if the database call fails completely, return empty
        if (!dbLeases) return [];

        // if data exists but isn't an array, it's a system error
        if (!Array.isArray(dbLeases)) {
            throw new Error("dhcp lease data in database is malformed");
        }

        if (Object.keys(filters).length === 0 && filters.constructor === Object) {
            dbLeases = dbLeases.filter((lease) => {
                return !lease.comment || lease.comment.toLowerCase().indexOf("[bug_sdwan]") === -1;
            });
        }

        if (filters?.["comment"]) {
            dbLeases = dbLeases.filter((lease) => {
                return lease.comment && lease.comment.toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
            });
        }

        const sortHandlerList = {
            comment: sortHandlers.string,
            address: sortHandlers.ipAddress,
            ["mac-address"]: sortHandlers.string,
            server: sortHandlers.string,
        };

        // sort
        if (sortField && sortHandlerList[sortField]) {
            if (sortDirection === "asc") {
                dbLeases.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
            } else {
                dbLeases.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
            }
        }

        return dbLeases;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`dhcplease-list error: ${error.message}`);
        throw error;
    }
};
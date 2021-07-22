"use strict";

const mongoCollection = require("@core/mongo-collection");
const oui = require("oui");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const dbLeases = await mongoCollection("leases");
    let leases = await dbLeases.find().toArray();
    if (!leases) {
        leases = [];
    }

    if (filters['name']) {
        leases = leases.filter((lease) => {
            const hasName = lease['host-name'] && lease['host-name'].toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
            const hasComment = lease.comment && lease.comment.toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
            return hasName || hasComment;
        });
    }

    if (filters['last-seen']) {
        leases = leases.filter((lease) => lease["last-seen"] < parseInt(filters['last-seen']));
    }

    if (filters['expires']) {
        leases = leases.filter((lease) => lease["expires"] > parseInt(filters['expires']));
    }

    if (filters['server']) {
        leases = leases.filter((lease) => lease["server"] === filters['server']);
    }

    if (filters['status']) {
        leases = leases.filter((lease) => lease["status"] === filters['status']);
    }

    if (filters['address']) {
        leases = leases.filter((lease) => {
            return lease['address'] && lease['address'].indexOf(filters.address) > -1;
        });
    }

    for (const eachLease of leases) {
        // set manufacturer
        eachLease["manufacturer"] = "";
        if (eachLease["mac-address"]) {
            const manufacturerResult = oui(eachLease["mac-address"]);
            if (manufacturerResult) {
                const resultArray = manufacturerResult.split("\n");
                eachLease["manufacturer"] = resultArray[0];
            }
        }

        // set sortable hostname field (or comment if not set)
        eachLease["name"] = "-- no name --";
        if (eachLease["host-name"]) {
            eachLease["name"] = eachLease["host-name"]
        }
        else if (eachLease["comment"]) {
            eachLease["name"] = eachLease["comment"]
        }
    }

    if (filters['manufacturer']) {
        leases = leases.filter((lease) => {
            return lease['manufacturer'] && lease['manufacturer'].toLowerCase().indexOf(filters.manufacturer.toLowerCase()) > -1;
        });
    }

    const sortHandlerList = {
        status: sortHandlers.string,
        disabled: sortHandlers.boolean,
        name: sortHandlers.string,
        address: sortHandlers.ipAddress,
        manufacturer: sortHandlers.string,
        ['mac-address']: sortHandlers.string,
        ['last-seen']: sortHandlers.number,
        ['last-seen']: sortHandlers.number,
        ['expires-after']: sortHandlers.number,
        server: sortHandlers.string,
    }

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            leases.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        }
        else {
            leases.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    return leases;
};

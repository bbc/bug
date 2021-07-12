"use strict";

const mongoCollection = require("@core/mongo-collection");
const oui = require("oui");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", since = 0, server = null) => {
    const dbLeases = await mongoCollection("leases");
    let leases = await dbLeases.find().toArray();
    if (!leases) {
        leases = [];
    }

    // filter since
    if (since > 0) {
        leases = leases.filter((lease) => lease["last-seen"] < since);
    }

    // filter server
    if (server) {
        leases = leases.filter((lease) => lease["server"] === server);
    }

    for (const eachLease of leases) {
        // set manufacturer
        eachLease["manufacturer"] = "";
        const manufacturerResult = oui(eachLease["mac-address"]);
        if (manufacturerResult) {
            const resultArray = manufacturerResult.split("\n");
            eachLease["manufacturer"] = resultArray[0];
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

"use strict";

const mongoCollection = require("@core/mongo-collection");
const oui = require("oui");

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
        eachLease["name"] = eachLease["host-name"] !== "" ? eachLease["host-name"] : eachLease["comment"];
    }

    // sort
    if (sortField) {
        if (sortDirection === "asc") {
            leases.sort((a, b) => a[sortField].localeCompare(b[sortField], "en", { sensitivity: "base" }));
        } else {
            leases.sort((a, b) => b[sortField].localeCompare(a[sortField], "en", { sensitivity: "base" }));
        }
    }

    return leases;
};

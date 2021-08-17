"use strict";

const mongoCollection = require("@core/mongo-collection");
const oui = require("oui");

module.exports = async (leaseId) => {
    const dbLeases = await mongoCollection("leases");
    let lease = await dbLeases.findOne({ "id": leaseId });

    // set manufacturer
    lease["manufacturer"] = "";
    if (lease["mac-address"]) {
        const manufacturerResult = oui(lease["mac-address"]);
        if (manufacturerResult) {
            const resultArray = manufacturerResult.split("\n");
            lease["manufacturer"] = resultArray[0];
        }
    }

    return lease;
};

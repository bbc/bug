"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");

module.exports = async function (config, snmpAwait) {

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();
    if (!interfaces?.length) {
        console.log("ciscoc1300-fetchinterfacestate: no interfaces found in db - waiting ...");
        await delay(5000);
        return;
    }

    // get subtree of interface link states
    const ifLinkStates = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.8",
    });

    // get subtree of interface admin states
    const ifAdminStates = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.7",
    });

    console.log(`ciscoc1300-fetchinterfacestate: got state for ${interfaces.length} interface(s) - updating db`);

    const bulkOperations = [];

    for (let eachInterface of interfaces) {
        const interfaceId = eachInterface.interfaceId;

        const linkState = ifLinkStates[`1.3.6.1.2.1.2.2.1.8.${interfaceId}`] === 1;
        const adminState = ifAdminStates[`1.3.6.1.2.1.2.2.1.7.${interfaceId}`] === 1;

        bulkOperations.push({
            updateOne: {
                filter: { interfaceId },
                update: { $set: { "link-state": linkState, "admin-state": adminState } },
                upsert: false
            }
        });

    }

    if (bulkOperations.length) {
        await interfacesCollection.bulkWrite(bulkOperations);
    }
};

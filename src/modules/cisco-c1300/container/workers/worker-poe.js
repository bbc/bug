"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");
const mongoCreateIndex = require("@core/mongo-createindex");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData.address,
    community: workerData.snmpCommunity,
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");
    const historyCollection = await mongoCollection("history");

    // and now create indexes with ttl
    await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

    // Kick things off
    console.log(`worker-poe: connecting to device at ${workerData.address}`);

    while (true) {
        await delay(9999999);

        // // get list of interfaces
        // const interfaces = await interfacesCollection.find().toArray();
        // if (!interfaces) {
        //     console.log("worker-poe: no interfaces found in db - waiting ...");
        //     await delay(5000);
        // } else {

        //     // get subtree of interface poe power
        //     const ifPoePower = await snmpAwait.subtree({
        //         maxRepetitions: 1000,
        //         oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.5",
        //     });

        //     const ifPoePowerLimit = await snmpAwait.subtree({
        //         maxRepetitions: 1000,
        //         oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.6",
        //     });

        //     const ifPoeStatus = await snmpAwait.subtree({
        //         maxRepetitions: 1000,
        //         oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.7",
        //     });

        //     // const ifPoeOperStatus = await snmpAwait.subtree({
        //     //     maxRepetitions: 1000,
        //     //     oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.11",
        //     // });

        //     console.log(ifPoePowerLimit);
        //     for (let eachInterface of interfaces) {
        //         // we create a new object, and use $set in mongo, so we don't overwrite the main interface worker results
        //         const fieldsToUpdate = {};

        //         // fetch the values from the SNMP results
        //         const poePower = ifPoePower[`1.3.6.1.4.1.9.6.1.101.108.1.1.5.1.${eachInterface.interfaceId}`];
        //         const poePowerLimit = ifPoePowerLimit[`1.3.6.1.4.1.9.6.1.101.108.1.1.6.1.${eachInterface.interfaceId}`];
        //         const poeStatus = ifPoeStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.7.1.${eachInterface.interfaceId}`];

        //         // save current values back
        //         fieldsToUpdate["poe-power"] = poePower;
        //         fieldsToUpdate["poe-power-limit"] = poePowerLimit;
        //         fieldsToUpdate["poe-status"] = poeStatus;

        //         // save back to database
        //         await interfacesCollection.updateOne(
        //             {
        //                 interfaceId: eachInterface.interfaceId,
        //             },
        //             { $set: fieldsToUpdate }
        //         );
        //     }

        // }

        // await delay(5000);
    }
};

main();

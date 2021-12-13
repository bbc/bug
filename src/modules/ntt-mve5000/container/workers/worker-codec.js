"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const snmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");
const deviceOids = require("@utils/device-oids");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-codec: connecting to device at ${workerData.address}`);

    while (true) {
        const snmpResults = await snmpAwait.getMultiple({
            host: workerData.address,
            community: workerData.snmpCommunity,
            maxRepetitions: 1000,
            oids: Object.keys(deviceOids),
        });

        const results = {};

        for (const [oid, label] of Object.entries(deviceOids)) {
            if (snmpResults[oid] !== undefined) {
                results[label] = snmpResults[oid];
            }
        }

        // update the db
        await mongoSingle.set("codecdata", results, 60);

        // wait 5 seconds
        await delay(5000);
    }
};

main();

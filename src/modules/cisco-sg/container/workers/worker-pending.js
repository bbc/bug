"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ciscoSGSNMP = require("@utils/ciscosg-snmp");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-pending: connecting to device at ${workerData.address}`);

    while (true) {
        const result = await ciscoSGSNMP.get({
            host: workerData.address,
            community: workerData.snmpCommunity,
            oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
        });
        await mongoSingle.set("pending", result === 2, 60);
        await delay(2000);
    }
};

main();

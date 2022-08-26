"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");

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
    await delay(999999);

    // // Connect to the db
    // await mongoDb.connect(workerData.id);

    // // Kick things off
    // console.log(`worker-pending: connecting to device at ${workerData.address}`);

    // while (true) {
    //     const result = await snmpAwait.get({
    //         oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
    //     });
    //     await mongoSingle.set("pending", result === 2, 60);
    //     await delay(2000);
    // }
};

main();

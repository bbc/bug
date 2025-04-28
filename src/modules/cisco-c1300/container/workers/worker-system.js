"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
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
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    while (true) {
        // get the system info
        const systemResult = await snmpAwait.getMultiple({
            oids: [
                "1.3.6.1.2.1.1.1.0",
                "1.3.6.1.2.1.1.3.0",
                "1.3.6.1.2.1.1.4.0",
                "1.3.6.1.2.1.1.5.0",
                "1.3.6.1.2.1.1.6.0",
            ],
        });

        if (systemResult) {
            const payload = {
                description: systemResult["1.3.6.1.2.1.1.1.0"],
                uptime: systemResult["1.3.6.1.2.1.1.3.0"],
                contact: systemResult["1.3.6.1.2.1.1.4.0"],
                name: systemResult["1.3.6.1.2.1.1.5.0"],
                location: systemResult["1.3.6.1.2.1.1.6.0"],
            };
            await mongoSingle.set("system", payload, 120);
        }
        await delay(1000);

        // get the pending flag
        const pendingResult = await snmpAwait.get({
            oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
        });
        await mongoSingle.set("pending", pendingResult === 2, 60);
        await delay(1000);
    }
};

main();

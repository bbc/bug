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
        const result = await snmpAwait.getMultiple({
            oids: [
                "1.3.6.1.2.1.1.1.0",
                "1.3.6.1.2.1.1.3.0",
                "1.3.6.1.2.1.1.4.0",
                "1.3.6.1.2.1.1.5.0",
                "1.3.6.1.2.1.1.6.0",
            ],
        });

        if (result) {
            const payload = {
                description: result["1.3.6.1.2.1.1.1.0"],
                uptime: result["1.3.6.1.2.1.1.3.0"],
                contact: result["1.3.6.1.2.1.1.4.0"],
                name: result["1.3.6.1.2.1.1.5.0"],
                location: result["1.3.6.1.2.1.1.6.0"],
            };
            await mongoSingle.set("system", payload, 120);
        }
        await delay(2000);
    }
};

main();

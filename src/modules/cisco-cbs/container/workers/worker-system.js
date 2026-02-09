"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const ciscoCBSFetchSystem = require("../utils/ciscocbs-fetchsystem");
const ciscoCBSFetchPassword = require("../utils/ciscocbs-fetchpassword");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const pollInterval = 900000; // 15 minutes

let snmpAwait;

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.snmpCommunity) {
            throw new Error("missing SNMP connection details in workerData");
        }

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
            timeout: 30000
        });

        while (true) {
            // fetch system information
            await ciscoCBSFetchSystem(workerData, snmpAwait);

            // fetch password information
            await ciscoCBSFetchPassword(workerData, snmpAwait);

            // wait until next poll
            await delay(pollInterval);
        }
    } catch (err) {
        console.error(`worker-system: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main().catch(err => {
    console.error("worker-system: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});

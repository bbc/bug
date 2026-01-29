"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const ciscoC1300FetchSystem = require("../utils/ciscoc1300-fetchsystem");
const ciscoC1300FetchPassword = require("../utils/ciscoc1300-fetchpassword");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const pollInterval = 1000000; // ~16 minutes

let snmpAwait;

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.snmpCommunity) {
            throw new Error("Missing SNMP connection details in workerData");
        }

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
        });

        while (true) {
            try {
                // fetch system information
                await ciscoC1300FetchSystem(workerData, snmpAwait);
            } catch (err) {
                console.error(`worker-cisco-system(thread ${threadId}): error fetching system info`);
                console.error(err.stack || err.message || err);
            }

            try {
                // fetch password information
                await ciscoC1300FetchPassword(workerData, snmpAwait);
            } catch (err) {
                console.error(`worker-cisco-system(thread ${threadId}): error fetching password info`);
                console.error(err.stack || err.message || err);
            }

            // wait until next poll
            await delay(pollInterval);
        }
    } catch (err) {
        console.error(`worker-cisco-system(thread ${threadId}): fatal error`);
        console.error(err.stack || err.message || err);
        process.exit(1); // allow manager to restart
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main();

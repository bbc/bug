"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const fetchInterfaceDetails = require("../utils/ciscocbs-fetchinterfacedetails");
const fetchInterfaceState = require("../utils/ciscocbs-fetchinterfacestate");
const fetchInterfaceStats = require("../utils/ciscocbs-fetchinterfacestats");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
let snmpAwait;

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.snmpCommunity) {
            throw new Error("missing SNMP connection details in workerData");
        }

        // stagger start of script ...
        await delay(4000);

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // create new SNMP session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
            timeout: 30000
        });

        // create indexes with TTL
        const historyCollection = await mongoCollection("history");
        await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

        while (true) {
            // fetch interface details, state, and stats
            await fetchInterfaceDetails(workerData, snmpAwait);
            await delay(2000);
            await fetchInterfaceState(workerData, snmpAwait);
            await delay(2000);
            await fetchInterfaceStats(workerData, snmpAwait);

            // pause between polling cycles
            await delay(15000);
        }
    } catch (err) {
        console.error(`worker-interfacedetails: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main().catch(err => {
    console.error("worker-interfacedetails: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
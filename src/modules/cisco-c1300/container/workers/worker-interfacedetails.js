"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const fetchInterfaceDetails = require("../utils/ciscoc1300-fetchinterfacedetails");
const fetchInterfaceState = require("../utils/ciscoc1300-fetchinterfacestate");
const fetchInterfaceStats = require("../utils/ciscoc1300-fetchinterfacestats");
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
            throw new Error("Missing SNMP connection details in workerData");
        }

        // stagger start of script ...
        await delay(4000);

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // create new SNMP session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
        });

        // create indexes with TTL
        const historyCollection = await mongoCollection("history");
        await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

        while (true) {
            // fetch interface details, state, and stats
            await fetchInterfaceDetails(workerData, snmpAwait);
            await fetchInterfaceState(workerData, snmpAwait);
            await fetchInterfaceStats(workerData, snmpAwait);

            // pause between polling cycles
            await delay(10500);
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

main();

"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const ciscoc1300FetchVlans = require("../utils/ciscoc1300-fetchvlans");
const ciscoc1300FetchInterfaceVlans = require("../utils/ciscoc1300-fetchinterfacevlans");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

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
            // fetch VLAN information
            await ciscoc1300FetchVlans(workerData, snmpAwait);

            await delay(1000);

            // fetch interface VLAN assignments
            await ciscoc1300FetchInterfaceVlans(workerData, snmpAwait);

            // wait before next poll
            await delay(20000);
        }
    } catch (err) {
        console.error(`worker-vlans: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main();

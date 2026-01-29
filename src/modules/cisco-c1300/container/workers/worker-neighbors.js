"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");
const subworkerInterfaceFdb = require("@services/subworker-interfacefdb");
const subworkerInterfaceLldp = require("@services/subworker-interfacelldp");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity", "dhcpSources"],
});

let snmpAwait;

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.snmpCommunity) {
            throw new Error("Missing SNMP connection details in workerData");
        }

        // stagger start of script ...
        await delay(2000);

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // get the collection reference
        const interfacesCollection = await mongoCollection("interfaces");

        // create new SNMP session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
            timeout: 20000
        });

        while (true) {
            // fetch FDB information
            await subworkerInterfaceFdb({ snmpAwait, interfacesCollection });

            await delay(1000); // small pause between subworkers

            // fetch LLDP information
            await subworkerInterfaceLldp({ snmpAwait, interfacesCollection });

            // wait before next full poll
            await delay(10000);
        }
    } catch (err) {
        console.error(`worker-neighbors: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main();

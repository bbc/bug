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

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData?.address,
    community: workerData?.snmpCommunity,
});

const main = async () => {
    // stagger start of script ...
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    while (true) {
        await subworkerInterfaceFdb({ snmpAwait, interfacesCollection });

        await delay(1000);

        await subworkerInterfaceLldp({ snmpAwait, interfacesCollection });

        await delay(10000);
    }
};

main();

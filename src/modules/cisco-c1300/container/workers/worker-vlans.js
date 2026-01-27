"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");
const ciscoc1300FetchVlans = require("../utils/ciscoc1300-fetchvlans");
const ciscoc1300FetchInterfaceVlans = require("../utils/ciscoc1300-fetchinterfacevlans");

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

    while (true) {
        await ciscoc1300FetchVlans(workerData, snmpAwait);
        await delay(1000);
        await ciscoc1300FetchInterfaceVlans(workerData, snmpAwait);
        await delay(20000);
    }
};

main();

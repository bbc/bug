"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const snmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-vlans: connecting to device at ${workerData.address}`);

    while (true) {
        const vlanResults = await snmpAwait.subtree({
            host: workerData.address,
            community: workerData.snmpCommunity,
            oid: ".1.3.6.1.2.1.17.7.1.4.3.1.1",
        });

        if (vlanResults) {
            const vlans = [];

            // some switches include the default VLAN (1) in the list - we should check
            // and provide it if it's missing
            if (vlanResults["1.3.6.1.2.1.17.7.1.4.3.1.1.1"] === undefined) {
                vlans.push({ id: 1, label: "Default" });
            }

            for (let [eachOid, eachResult] of Object.entries(vlanResults)) {
                const vlan = eachOid.substring(eachOid.lastIndexOf(".") + 1);
                if (!eachResult) {
                    eachResult = `VLAN_${vlan}`;
                }
                vlans.push({
                    id: parseInt(vlan),
                    label: eachResult,
                });
            }

            await mongoSingle.set("vlans", vlans, 60);
        }
        await delay(20400);
    }
};

main();

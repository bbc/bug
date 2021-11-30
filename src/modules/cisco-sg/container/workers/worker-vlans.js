"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ciscoSGSNMP = require("../utils/ciscosg-snmp");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmp_community"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-vlans: connecting to device at ${workerData.address}`);

    while (true) {
        const vlanResults = await ciscoSGSNMP.subtree({
            host: workerData.address,
            community: workerData.snmp_community,
            oid: ".1.3.6.1.2.1.17.7.1.4.3.1.1",
        });

        if (vlanResults) {
            const vlans = [{ id: 1, label: "Default" }];

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

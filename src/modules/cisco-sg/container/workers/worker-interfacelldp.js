"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const chunk = require("@core/chunk");
const SnmpAwait = require("@core/snmp-await");

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

const parseHexString = (hexString) => {
    // check if the string value is only letters, numbers or slash
    const string = hexString.toString();
    if (/^[a-zA-Z0-9\/]+$/.test(string)) {
        return string;
    }
    // otherwise, it's probably a MAC address
    const chunks = chunk(hexString.toString("hex"), 2);
    return chunks.join(":");
};

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacelldp: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch list of LLDP neighbors
        const lldpInfo = await snmpAwait.subtree({
            oid: "1.0.8802.1.1.2.1.4.1.1",
            timeout: 30000,
            raw: true,
        });

        const needles = {
            "1.0.8802.1.1.2.1.4.1.1.5.0": "chassis_id",
            "1.0.8802.1.1.2.1.4.1.1.7.0": "port_id",
            "1.0.8802.1.1.2.1.4.1.1.8.0": "port_description",
            "1.0.8802.1.1.2.1.4.1.1.9.0": "system_name",
            "1.0.8802.1.1.2.1.4.1.1.10.0": "system_description",
        };

        const lldpByInterface = [];

        Object.entries(lldpInfo).forEach(([oid, value]) => {
            for (const [needleOid, needleValue] of Object.entries(needles)) {
                if (oid.indexOf(needleOid) === 0) {
                    const oidArray = oid.split(".");
                    const interfaceId = parseInt(oidArray[oidArray.length - 2]);

                    if (!lldpByInterface[interfaceId]) {
                        lldpByInterface[interfaceId] = {};
                    }
                    if (needleValue === "chassis_id" || needleValue === "port_id") {
                        lldpByInterface[interfaceId][needleValue] = parseHexString(value);
                    } else {
                        lldpByInterface[interfaceId][needleValue] = value.toString();
                    }
                }
            }
        });

        lldpByInterface.forEach(async (lldpObject, eachIndex) => {
            await interfacesCollection.updateOne(
                { interfaceId: parseInt(eachIndex) },
                {
                    $set: {
                        lldp: lldpObject,
                    },
                },
                { upsert: false }
            );
        });

        // every 30 seconds
        await delay(30000);
    }
};

main();

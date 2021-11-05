"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSNMP = require("@utils/ciscosg-snmp");

let interfacesCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

// see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

const convertAdminPortSpeed = (speed) => {
    switch (speed) {
        case 10:
            return "10G";
        case 1000000000:
            return "1000M";
        case 100000000:
            return "100M";
        case 100000000:
            return "10M";
        default:
            return "";
    }
}

const convertOperationalPortSpeed = (speed) => {
    switch (speed) {
        case 10000:
            return "10G";
        case 1000:
            return "1000M";
        case 100:
            return "100M";
        case 10:
            return "10M";
        default:
            return "";
    }
}

const main = async () => {

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacedetails: connecting to device at ${workerData.address}`);

    while (true) {

        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces) {
            console.log("worker-interfacedetails: no interfaces found in db - waiting ...");
            await delay(5000);
        }
        else {

            // get subtree of interface admin states
            const ifAliases = await ciscoSGSNMP.subtree({
                host: workerData.address,
                community: workerData.snmp_community,
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.31.1.1.1.18"
            });

            // get subtree of interface admin states
            const ifAutoNegotiation = await ciscoSGSNMP.subtree({
                host: workerData.address,
                community: workerData.snmp_community,
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16"
            });

            // get subtree of interface admin states
            const ifAdminPortSpeed = await ciscoSGSNMP.subtree({
                host: workerData.address,
                community: workerData.snmp_community,
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15"
            });

            // get subtree of interface admin states
            const ifOperationalPortSpeed = await ciscoSGSNMP.subtree({
                host: workerData.address,
                community: workerData.snmp_community,
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.31.1.1.1.15"
            });

            for (let eachInterface of interfaces) {
                const alias = ifAliases[`1.3.6.1.2.1.31.1.1.1.18.${eachInterface.interfaceId}`];
                const autoNegotiationState = (ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${eachInterface.interfaceId}`] === 1);
                const adminPortSpeed = convertAdminPortSpeed(ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${eachInterface.interfaceId}`]);
                const operationalPortSpeed = convertOperationalPortSpeed(ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${eachInterface.interfaceId}`]);

                await interfacesCollection.updateOne(
                    { "interfaceId": eachInterface.interfaceId },
                    {
                        "$set": {
                            "alias": alias,
                            "auto_negotiation": autoNegotiationState,
                            "admin_speed": adminPortSpeed,
                            "operational_speed": operationalPortSpeed
                        }
                    },
                    { upsert: false });
            }
        }

        await delay(10500);
    }
}

main();

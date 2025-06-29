"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
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

// see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

const convertAdminPortSpeed = (speed) => {
    switch (speed) {
        case 10:
            return "10G";
        case 1000000000:
            return "1G";
        case 100000000:
            return "100M";
        case 100000000:
            return "10M";
        default:
            return "";
    }
};

const convertOperationalPortSpeed = (speed) => {
    switch (speed) {
        case 10000:
            return "10G";
        case 1000:
            return "1G";
        case 100:
            return "100M";
        case 10:
            return "10M";
        default:
            return "";
    }
};

// From the SNMP MIB files:
// 1 - none: no PoE, unknown type;
// 2 - PoE: Standard AF PoE
// 3 - PoE Plus: Standard AT PoE
// 4 - 60 W: 60W poe port
// 5 - PoE BT-type3: 802.3BT standard, type 3
// 6 - PoE BT-type4: 802.3BT standard, type 4

const convertPoeDescription = (value) => {
    switch (value) {
        case 1:
            return "None";
        case 2:
            return "802.3af PoE";
        case 3:
            return "802.at PoE+";
        case 4:
            return "60W PoE";
        case 5:
            return "802.3bt Type 3"
        case 6:
            return "802.3bt Type 4"
        default:
            return "";
    }
};

const convertPoePortType = (value) => {
    switch (value) {
        case 1:
            return false
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return true;
        default:
            return false
    }
}

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacedetails: connecting to device at ${workerData.address}`);

    while (true) {
        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces) {
            console.log("worker-interfacedetails: no interfaces found in db - waiting ...");
            await delay(5000);
        } else {
            const ifAliases = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.31.1.1.1.18",
            });

            const ifAutoNegotiation = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16",
            });

            const ifAdminPortSpeed = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15",
            });

            const ifOperationalPortSpeed = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.31.1.1.1.15",
            });

            const pethPsePortAdminEnable = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.105.1.1.1.3.1",
            });

            const rlPethPsePortOperStatus = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.11.1",
            });

            const rlPethPsePortSupportPoeType = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.13.1",
            });

            const rlPethPsePortOutputPower = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.5.1",
            });

            const rlPethPsePortStatusDescription = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.8.1",
            });

            const rlPethPsePortStatus = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.7.1",
            });

            for (let eachInterface of interfaces) {
                const alias = ifAliases[`1.3.6.1.2.1.31.1.1.1.18.${eachInterface.interfaceId}`];
                const autoNegotiationState =
                    ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${eachInterface.interfaceId}`] === 1;
                const adminPortSpeed = convertAdminPortSpeed(
                    ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${eachInterface.interfaceId}`]
                );
                const operationalPortSpeed = convertOperationalPortSpeed(
                    ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${eachInterface.interfaceId}`]
                );
                const poeAdminEnable =
                    pethPsePortAdminEnable[`1.3.6.1.2.1.105.1.1.1.3.1.${eachInterface.interfaceId}`] === 1

                const poeOperStatus =
                    rlPethPsePortOperStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.11.1.${eachInterface.interfaceId}`] === 1

                const poeAvailable = convertPoePortType(rlPethPsePortSupportPoeType[`1.3.6.1.4.1.9.6.1.101.108.1.1.13.1.${eachInterface.interfaceId}`]);
                const poeDescription = convertPoeDescription(rlPethPsePortSupportPoeType[`1.3.6.1.4.1.9.6.1.101.108.1.1.13.1.${eachInterface.interfaceId}`]);
                const poePower = rlPethPsePortOutputPower[`1.3.6.1.4.1.9.6.1.101.108.1.1.5.1.${eachInterface.interfaceId}`] ?? 0;
                const poePortStatusDescription = rlPethPsePortStatusDescription[`1.3.6.1.4.1.9.6.1.101.108.1.1.8.1.${eachInterface.interfaceId}`] ?? "";
                const poePortError = rlPethPsePortStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.7.1.${eachInterface.interfaceId}`] === 9

                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface.interfaceId },
                    {
                        $set: {
                            alias: alias,
                            "auto-negotiation": autoNegotiationState,
                            "admin-speed": adminPortSpeed,
                            "operational-speed": operationalPortSpeed,
                            "poe-admin-enable": poeAdminEnable,
                            "poe-operational-status": poeOperStatus,
                            "poe-available": poeAvailable,
                            "poe-description": poeDescription,
                            "poe-power": poePower,
                            "poe-port-status-description": poePortStatusDescription,
                            "poe-error": poePortError
                        },
                    },
                    { upsert: false }
                );
            }
        }

        await delay(10500);
    }
};

main();

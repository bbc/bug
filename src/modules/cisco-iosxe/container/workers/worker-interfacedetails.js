"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const convertPortSpeed = (speed) => {
    switch (speed) {
        case 10240000:
            return "10M";
        case 102400000:
            return "100M";
        case 1024000000:
            return "1G";
        case 10240000000:
            return "10G";
        case 25600000000:
            return "25G";
        case 40960000000:
            return "40G";
        case 51200000000:
            return "50G";
        case 102400000000:
            return "100G";
        case 204800000000:
            return "200G";
        case 409600000000:
            return "400G";
        default:
            return "";
    }
};

const main = async () => {
    // wait 5 seconds
    await delay(5000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacedetails: connecting to device at ${workerData.address}`);

    const data = {
        fields: "interface-type;oper-status;name;description;speed;admin-status",
    };

    while (true) {
        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces/interface",
            data: data,
            timeout: 5000,
            username: workerData["username"],
            password: workerData["password"],
        });

        for (const eachInterface of result?.["Cisco-IOS-XE-interfaces-oper:interface"]) {
            if (eachInterface["interface-type"] === "iana-iftype-ethernet-csmacd") {
                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface["name"] },
                    {
                        $set: {
                            description: eachInterface["description"],
                            "oper-status": eachInterface["oper-status"],
                            "admin-status": eachInterface["admin-status"],
                            "admin-speed": convertPortSpeed(parseInt(eachInterface["speed"])),
                        },
                    },
                    { upsert: false }
                );
            }
        }

        // wait 10 seconds
        await delay(10000);
    }
};

main();

// "use strict";

// const { parentPort, workerData, threadId } = require("worker_threads");
// const delay = require("delay");
// const register = require("module-alias/register");
// const mongoDb = require("@core/mongo-db");
// const mongoCollection = require("@core/mongo-collection");
// const SnmpAwait = require("@core/snmp-await");

// // Tell the manager the things you care about
// parentPort.postMessage({
//     restartDelay: 10000,
//     restartOn: ["address", "snmpCommunity"],
// });

// // create new snmp session
// const snmpAwait = new SnmpAwait({
//     host: workerData.address,
//     community: workerData.snmpCommunity,
// });

// // see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

// const convertAdminPortSpeed = (speed) => {
//     switch (speed) {
//         case 10:
//             return "10G";
//         case 1000000000:
//             return "1G";
//         case 100000000:
//             return "100M";
//         case 100000000:
//             return "10M";
//         default:
//             return "";
//     }
// };

// const convertOperationalPortSpeed = (speed) => {
//     switch (speed) {
//         case 10000:
//             return "10G";
//         case 1000:
//             return "1G";
//         case 100:
//             return "100M";
//         case 10:
//             return "10M";
//         default:
//             return "";
//     }
// };

// const main = async () => {
//     // Connect to the db
//     await mongoDb.connect(workerData.id);

//     // get the collection reference
//     const interfacesCollection = await mongoCollection("interfaces");

//     // Kick things off
//     console.log(`worker-interfacedetails: connecting to device at ${workerData.address}`);

//     while (true) {
//         // get list of interfaces
//         const interfaces = await interfacesCollection.find().toArray();
//         if (!interfaces) {
//             console.log("worker-interfacedetails: no interfaces found in db - waiting ...");
//             await delay(5000);
//         } else {
//             const ifAliases = await snmpAwait.subtree({
//                 maxRepetitions: 1000,
//                 oid: "1.3.6.1.2.1.31.1.1.1.18",
//             });

//             const ifAutoNegotiation = await snmpAwait.subtree({
//                 maxRepetitions: 1000,
//                 oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16",
//             });

//             const ifAdminPortSpeed = await snmpAwait.subtree({
//                 maxRepetitions: 1000,
//                 oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15",
//             });

//             const ifOperationalPortSpeed = await snmpAwait.subtree({
//                 maxRepetitions: 1000,
//                 oid: "1.3.6.1.2.1.31.1.1.1.15",
//             });

//             for (let eachInterface of interfaces) {
//                 const alias = ifAliases[`1.3.6.1.2.1.31.1.1.1.18.${eachInterface.interfaceId}`];
//                 const autoNegotiationState =
//                     ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${eachInterface.interfaceId}`] === 1;
//                 const adminPortSpeed = convertAdminPortSpeed(
//                     ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${eachInterface.interfaceId}`]
//                 );
//                 const operationalPortSpeed = convertOperationalPortSpeed(
//                     ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${eachInterface.interfaceId}`]
//                 );

//                 // await interfacesCollection.updateOne(
//                 //     { interfaceId: eachInterface.interfaceId },
//                 //     {
//                 //         $set: {
//                 //             alias: alias,
//                 //             "auto-negotiation": autoNegotiationState,
//                 //             "admin-speed": adminPortSpeed,
//                 //             "operational-speed": operationalPortSpeed,
//                 //         },
//                 //     },
//                 //     { upsert: false }
//                 // );
//             }

//             await delay(999999);
//         }

//         await delay(10500);
//     }
// };

// main();

"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");

// see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

const convertAdminPortSpeed = (speed) => {
    switch (speed) {
        case 10: return "10G";
        case 1000000000: return "1G";
        case 100000000: return "100M";
        case 10000000: return "10M";
        default: return "";
    }
};

const convertOperationalPortSpeed = (speed) => {
    switch (speed) {
        case 10000: return "10G";
        case 1000: return "1G";
        case 100: return "100M";
        case 10: return "10M";
        default: return "";
    }
};

const convertPoeDescription = (value) => {
    switch (value) {
        case 1: return "None";
        case 2: return "802.3af PoE";
        case 3: return "802.at PoE+";
        case 4: return "60W PoE";
        case 5: return "802.3bt Type 3";
        case 6: return "802.3bt Type 4";
        default: return "";
    }
};

const convertPoePortType = (value) => {
    return value >= 2 && value <= 6;
};

module.exports = async function (config, snmpAwait) {

    const interfacesCollection = await mongoCollection("interfaces");

    const interfaces = await interfacesCollection.find().toArray();
    if (!interfaces?.length) {
        console.log("ciscocbs-fetchinterfacedetails: no interfaces found in db - waiting ...");
        await delay(5000);
        return;
    }

    // Fetch SNMP data in bulk
    const [
        ifAliases,
        ifAutoNegotiation,
        ifAdminPortSpeed,
        ifOperationalPortSpeed,
        pethPsePortAdminEnable,
        rlPethPsePortOperStatus,
        rlPethPsePortSupportPoeType,
        rlPethPsePortOutputPower,
        rlPethPsePortStatusDescription,
        rlPethPsePortStatus
    ] = await Promise.all([
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.2.1.31.1.1.1.18" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.2.1.31.1.1.1.15" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.2.1.105.1.1.1.3.1" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.11.1" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.13.1" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.5.1" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.8.1" }),
        snmpAwait.subtree({ maxRepetitions: 1000, oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.7.1" }),
    ]);

    console.log(`ciscocbs-fetchinterfacedetails: got details for ${interfaces.length} interface(s) - updating db`);

    const bulkOperations = [];

    for (const eachInterface of interfaces) {
        const interfaceId = eachInterface.interfaceId;

        const alias = ifAliases[`1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`];
        const autoNegotiationState = ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${interfaceId}`] === 1;
        const adminPortSpeed = convertAdminPortSpeed(ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${interfaceId}`]);
        const operationalPortSpeed = convertOperationalPortSpeed(ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${interfaceId}`]);

        const poeAdminEnable = pethPsePortAdminEnable[`1.3.6.1.2.1.105.1.1.1.3.1.${interfaceId}`] === 1;
        const poeOperStatus = rlPethPsePortOperStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.11.1.${interfaceId}`] === 1;

        const poeTypeValue = rlPethPsePortSupportPoeType[`1.3.6.1.4.1.9.6.1.101.108.1.1.13.1.${interfaceId}`];
        const poeAvailable = convertPoePortType(poeTypeValue);
        const poeDescription = convertPoeDescription(poeTypeValue);

        const poePower = rlPethPsePortOutputPower[`1.3.6.1.4.1.9.6.1.101.108.1.1.5.1.${interfaceId}`] ?? 0;
        const poePortStatusDescription = rlPethPsePortStatusDescription[`1.3.6.1.4.1.9.6.1.101.108.1.1.8.1.${interfaceId}`] ?? "";
        const poePortError = rlPethPsePortStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.7.1.${interfaceId}`] === 9;

        bulkOperations.push({
            updateOne: {
                filter: { interfaceId },
                update: {
                    $set: {
                        alias,
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
                    }
                },
                upsert: false
            }
        });
    }

    if (bulkOperations.length) {
        const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
        console.log(`ciscocbs-fetchinterfacedetails: updated db for ${bulkResult.modifiedCount} interface(s)`);
    }
};

"use strict";

const logger = require("@core/logger")(module);

// see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

const convertAdminPortSpeed = (speed) => {
    switch (speed) {
        case 10:
            return "10G";
        case 1000000000:
            return "1G";
        case 100000000:
            return "100M";
        case 10000000:
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
            return "802.3bt Type 3";
        case 6:
            return "802.3bt Type 4";
        default:
            return "";
    }
};

const convertPoePortType = (value) => {
    return value >= 2 && value <= 6;
};

const SNMP_CHUNK_SIZE = 10;

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();

        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db yet - waiting ...");
            return;
        }

        const interfaceIds = interfaces.map((iface) => iface.interfaceId);

        const aliasOids = interfaceIds.map((interfaceId) => `1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`);
        const autoNegotiationOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.43.1.1.16.${interfaceId}`
        );
        const adminPortSpeedOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.43.1.1.15.${interfaceId}`
        );
        const operationalPortSpeedOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.2.1.31.1.1.1.15.${interfaceId}`
        );
        const poeAdminEnableOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.2.1.105.1.1.1.3.1.${interfaceId}`
        );
        const poeOperStatusOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.108.1.1.11.1.${interfaceId}`
        );
        const poeSupportTypeOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.108.1.1.13.1.${interfaceId}`
        );
        const poeOutputPowerOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.108.1.1.5.1.${interfaceId}`
        );
        const poeStatusDescriptionOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.108.1.1.8.1.${interfaceId}`
        );
        const poeStatusOids = interfaceIds.map(
            (interfaceId) => `1.3.6.1.4.1.9.6.1.101.108.1.1.7.1.${interfaceId}`
        );

        const [
            ifAliases,
            ifAutoNegotiation,
            ifAdminPortSpeed,
            ifOperationalPortSpeed,
        ] = await Promise.all([
            snmpAwait.getMultiple({ oids: aliasOids, ignoreMissing: true, chunkSize: SNMP_CHUNK_SIZE }),
            snmpAwait.getMultiple({
                oids: autoNegotiationOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: adminPortSpeedOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: operationalPortSpeedOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
        ]);

        const [
            pethPsePortAdminEnable,
            rlPethPsePortOperStatus,
            rlPethPsePortSupportPoeType,
            rlPethPsePortOutputPower,
            rlPethPsePortStatusDescription,
            rlPethPsePortStatus,
        ] = await Promise.all([
            snmpAwait.getMultiple({
                oids: poeAdminEnableOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: poeOperStatusOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: poeSupportTypeOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: poeOutputPowerOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: poeStatusDescriptionOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
            snmpAwait.getMultiple({
                oids: poeStatusOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            }),
        ]);

        logger.debug(`got details for ${interfaces.length} interface(s) - updating db`);

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
                    filter: {
                        interfaceId,
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
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
                            "poe-error": poePortError,
                        },
                    },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface(s)`);
        }
    } catch (err) {
        logger.warning(`interfacedetails task failed: ${err.stack || err.message || err}`);
        return;
    }
};
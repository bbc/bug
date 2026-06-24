"use strict";

const logger = require("@core/logger")(module);

// see: http://www.circitor.fr/Mibs/Html/C/CISCOSB-rlInterfaces.php

const ALIAS_OID = "1.3.6.1.2.1.31.1.1.1.18";
const AUTO_NEGOTIATION_OID = "1.3.6.1.4.1.9.6.1.101.43.1.1.16";
const ADMIN_PORT_SPEED_OID = "1.3.6.1.4.1.9.6.1.101.43.1.1.15";
const OPERATIONAL_PORT_SPEED_OID = "1.3.6.1.2.1.31.1.1.1.15";
const SNMP_CHUNK_SIZE = 25;

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

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - skipping update of interface details");
            return;
        }

        const interfaceIds = interfaces.map((iface) => iface.interfaceId);
        const aliasOids = interfaceIds.map((interfaceId) => `${ALIAS_OID}.${interfaceId}`);
        const autoNegotiationOids = interfaceIds.map((interfaceId) => `${AUTO_NEGOTIATION_OID}.${interfaceId}`);
        const adminPortSpeedOids = interfaceIds.map((interfaceId) => `${ADMIN_PORT_SPEED_OID}.${interfaceId}`);
        const operationalPortSpeedOids = interfaceIds.map(
            (interfaceId) => `${OPERATIONAL_PORT_SPEED_OID}.${interfaceId}`
        );

        const ifAliases = aliasOids.length
            ? await snmpAwait.getMultiple({
                oids: aliasOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            })
            : {};

        const ifAutoNegotiation = autoNegotiationOids.length
            ? await snmpAwait.getMultiple({
                oids: autoNegotiationOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            })
            : {};

        const ifAdminPortSpeed = adminPortSpeedOids.length
            ? await snmpAwait.getMultiple({
                oids: adminPortSpeedOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            })
            : {};

        const ifOperationalPortSpeed = operationalPortSpeedOids.length
            ? await snmpAwait.getMultiple({
                oids: operationalPortSpeedOids,
                ignoreMissing: true,
                chunkSize: SNMP_CHUNK_SIZE,
            })
            : {};

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const alias = ifAliases[`${ALIAS_OID}.${interfaceId}`];
            const autoNegotiationState = ifAutoNegotiation[`${AUTO_NEGOTIATION_OID}.${interfaceId}`] === 1;
            const adminPortSpeed = convertAdminPortSpeed(
                ifAdminPortSpeed[`${ADMIN_PORT_SPEED_OID}.${interfaceId}`]
            );
            const operationalPortSpeed = convertOperationalPortSpeed(
                ifOperationalPortSpeed[`${OPERATIONAL_PORT_SPEED_OID}.${interfaceId}`]
            );

            bulkOperations.push({
                updateOne: {
                    filter: { interfaceId },
                    update: {
                        $set: {
                            alias,
                            "auto-negotiation": autoNegotiationState,
                            "admin-speed": adminPortSpeed,
                            "operational-speed": operationalPortSpeed,
                        },
                    },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db with details for ${bulkResult.modifiedCount} interface(s)`);
        }
    } catch (err) {
        logger.warning(`interfacedetails task failed: ${err.stack || err.message || err}`);
        return;
    }
};
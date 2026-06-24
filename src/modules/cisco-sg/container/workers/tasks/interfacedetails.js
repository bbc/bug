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

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - skipping update of interface details");
            return;
        }

        const ifAliases = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.2.1.31.1.1.1.18",
        });

        const ifAutoNegotiation = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16",
        });

        const ifAdminPortSpeed = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15",
        });

        const ifOperationalPortSpeed = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.2.1.31.1.1.1.15",
        });

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const alias = ifAliases[`1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`];
            const autoNegotiationState =
                ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${interfaceId}`] === 1;
            const adminPortSpeed = convertAdminPortSpeed(
                ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${interfaceId}`]
            );
            const operationalPortSpeed = convertOperationalPortSpeed(
                ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${interfaceId}`]
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
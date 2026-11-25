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

const readDetails = async (name, read) => {
    try {
        return await read();
    } catch (error) {
        logger.warning(`failed to read ${name}: ${error.stack || error.message || error}`);
        return null;
    }
};

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();

        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db yet - waiting ...");
            return false;
        }

        const ifAutoNegotiation = await readDetails("auto-negotiation", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.16", maxIndexExclusive: 1000 }));
        const ifAdminPortSpeed = await readDetails("admin speed", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.43.1.1.15", maxIndexExclusive: 1000 }));
        const ifOperationalPortSpeed = await readDetails("operational speed", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.2.1.31.1.1.1.15", maxIndexExclusive: 1000 }));
        logger.debug(`got details for ${interfaces.length} interface(s) - updating db`);

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const fieldsToUpdate = {};
            if (ifAutoNegotiation) fieldsToUpdate["auto-negotiation"] = ifAutoNegotiation[`1.3.6.1.4.1.9.6.1.101.43.1.1.16.${interfaceId}`] === 1;
            if (ifAdminPortSpeed) fieldsToUpdate["admin-speed"] = convertAdminPortSpeed(ifAdminPortSpeed[`1.3.6.1.4.1.9.6.1.101.43.1.1.15.${interfaceId}`]);
            if (ifOperationalPortSpeed) fieldsToUpdate["operational-speed"] = convertOperationalPortSpeed(ifOperationalPortSpeed[`1.3.6.1.2.1.31.1.1.1.15.${interfaceId}`]);
            if (!Object.keys(fieldsToUpdate).length) continue;

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
                        $set: fieldsToUpdate,
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
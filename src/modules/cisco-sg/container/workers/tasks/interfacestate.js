"use strict";

const logger = require("@core/logger")(module);

const LINK_STATE_OID = "1.3.6.1.2.1.2.2.1.8";

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();

        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - waiting ...");
            return false;
        }

        const interfaceIds = interfaces.map((iface) => iface.interfaceId);
        const linkStateOids = interfaceIds.map((interfaceId) => `${LINK_STATE_OID}.${interfaceId}`);
        const ifLinkStates = await snmpAwait.getMultiple({
            oids: linkStateOids,
            ignoreMissing: true,
            chunkSize: 40,
        });

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const linkState = ifLinkStates[`${LINK_STATE_OID}.${interfaceId}`] === 1;

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
                            "link-state": linkState,
                        },
                    },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface state(s)`);
        }
    } catch (err) {
        logger.warning(`interfacestate task failed: ${err.stack || err.message || err}`);
        return;
    }
};
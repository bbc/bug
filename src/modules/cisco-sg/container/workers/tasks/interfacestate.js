"use strict";

const logger = require("@core/logger")(module);

const LINK_STATE_OID = "1.3.6.1.2.1.2.2.1.8";
const ADMIN_STATE_OID = "1.3.6.1.2.1.2.2.1.7";

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();

        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - waiting ...");
            return;
        }

        const interfaceIds = interfaces.map((iface) => iface.interfaceId);
        const linkStateOids = interfaceIds.map((interfaceId) => `${LINK_STATE_OID}.${interfaceId}`);
        const adminStateOids = interfaceIds.map((interfaceId) => `${ADMIN_STATE_OID}.${interfaceId}`);

        const [ifLinkStates, ifAdminStates] = await Promise.all([
            linkStateOids.length
                ? snmpAwait.getMultiple({
                    oids: linkStateOids,
                    ignoreMissing: true,
                    chunkSize: 40,
                })
                : {},
            adminStateOids.length
                ? snmpAwait.getMultiple({
                    oids: adminStateOids,
                    ignoreMissing: true,
                    chunkSize: 40,
                })
                : {},
        ]);

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const linkState = ifLinkStates[`${LINK_STATE_OID}.${interfaceId}`] === 1;
            const adminState = ifAdminStates[`${ADMIN_STATE_OID}.${interfaceId}`] === 1;

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
                            "admin-state": adminState,
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
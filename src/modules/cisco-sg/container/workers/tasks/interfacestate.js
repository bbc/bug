"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - waiting ...");
            return;
        }

        const ifLinkStates = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.2.1.2.2.1.8",
        });

        const ifAdminStates = await snmpAwait.subtree({
            maxRepetitions: 50,
            oid: "1.3.6.1.2.1.2.2.1.7",
        });

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const linkState = ifLinkStates[`1.3.6.1.2.1.2.2.1.8.${interfaceId}`] === 1;
            const adminState = ifAdminStates[`1.3.6.1.2.1.2.2.1.7.${interfaceId}`] === 1;

            bulkOperations.push({
                updateOne: {
                    filter: { interfaceId },
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
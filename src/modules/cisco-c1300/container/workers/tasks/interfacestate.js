"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, interfacesCollection }) => {

    const pollStartedAt = new Date();

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();
    if (!interfaces?.length) {
        logger.debug("no interfaces found in db - waiting ...");
        return;
    }

    // get subtree of interface link states
    const ifLinkStates = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.8",
    });

    // get subtree of interface admin states
    const ifAdminStates = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.7",
    });

    logger.debug(`got state for ${interfaces.length} interface(s)`);

    const bulkOperations = [];

    for (let eachInterface of interfaces) {
        const interfaceId = eachInterface.interfaceId;

        const linkState = ifLinkStates[`1.3.6.1.2.1.2.2.1.8.${interfaceId}`] === 1;
        const adminState = ifAdminStates[`1.3.6.1.2.1.2.2.1.7.${interfaceId}`] === 1;

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
        if (bulkResult.modifiedCount) {
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface state(s)`);
        }
    }
};

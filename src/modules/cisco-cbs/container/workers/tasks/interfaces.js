"use strict";

const logger = require("@core/logger")(module);
const ciscoCBSSplitPort = require("@utils/ciscocbs-splitport");

module.exports = async ({ snmpAwait, interfacesCollection }) => {

    const ifIDs = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.8",
    });

    const ifShortIDs = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.31.1.1.1.1",
    });

    // now fetch interface name - which we need to calculate the stack
    const ifDescriptions = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.2",
    });

    const bulkOperations = [];

    for (let [eachOid, eachResult] of Object.entries(ifIDs)) {
        const interfaceId = parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1));
        if (eachResult < 3 && interfaceId < 1000) {
            const shortId = ifShortIDs[`1.3.6.1.2.1.31.1.1.1.1.${interfaceId}`];
            // check description
            const description = ifDescriptions[`1.3.6.1.2.1.2.2.1.2.${interfaceId}`];
            if (description) {
                const portArray = ciscoCBSSplitPort(description);
                const dbDocument = {
                    longId: description,
                    interfaceId: interfaceId,
                    shortId: shortId,
                    description: `${portArray.label}${portArray.port}`,
                    device: portArray.device,
                    slot: portArray.slot,
                    port: portArray.port,
                    timestamp: new Date(),
                };

                // prepare bulk write operation
                bulkOperations.push({
                    updateOne: {
                        filter: { interfaceId: dbDocument.interfaceId },
                        update: { $set: dbDocument },
                        upsert: true,
                    },
                });
            }
        }
    }

    logger.debug(`updated db with ${bulkOperations.length} interface(s)`);

    // perform all updates in a single bulk operation
    if (bulkOperations.length) {
        await interfacesCollection.bulkWrite(bulkOperations);
    }

}

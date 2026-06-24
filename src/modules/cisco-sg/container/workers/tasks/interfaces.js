"use strict";

const ciscoSGSplitPort = require("@utils/ciscosg-splitport");
const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const ifIDs = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.2.2.1.8",
        });

        const ifShortIDs = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.31.1.1.1.1",
        });

        // Fetch interface name, needed to calculate stack/slot/port metadata.
        const ifDescriptions = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.2.2.1.2",
        });

        const bulkOperations = [];

        for (const [eachOid, eachResult] of Object.entries(ifIDs)) {
            const interfaceId = parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1), 10);

            if (eachResult < 3 && interfaceId < 1000) {
                const shortId = ifShortIDs[`1.3.6.1.2.1.31.1.1.1.1.${interfaceId}`];
                const description = ifDescriptions[`1.3.6.1.2.1.2.2.1.2.${interfaceId}`];

                if (description) {
                    const portArray = ciscoSGSplitPort(description);
                    const dbDocument = {
                        longId: description,
                        interfaceId,
                        shortId,
                        description: `${portArray.label}${portArray.port}`,
                        device: portArray.device,
                        slot: portArray.slot,
                        port: portArray.port,
                        timestamp: new Date(),
                    };

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

        if (bulkOperations.length > 0) {
            await interfacesCollection.bulkWrite(bulkOperations);
        }

        logger.debug(`updated db with ${bulkOperations.length} interface(s)`);
    } catch (err) {
        logger.warning(`interfaces task failed: ${err.stack || err.message || err}`);
        return;
    }
};
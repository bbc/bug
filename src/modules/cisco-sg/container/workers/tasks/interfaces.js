"use strict";

const ciscoSGSplitPort = require("@utils/ciscosg-splitport");
const logger = require("@core/logger")(module);

const IF_STATUS_OID = "1.3.6.1.2.1.2.2.1.8";
const IF_SHORT_ID_OID = "1.3.6.1.2.1.31.1.1.1.1";
const IF_DESCRIPTION_OID = "1.3.6.1.2.1.2.2.1.2";
const INTERFACE_SUBTREE_MAX_REPETITIONS = 20;
const SNMP_CHUNK_SIZE = 25;

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const ifIDs = await snmpAwait.subtree({
            maxRepetitions: INTERFACE_SUBTREE_MAX_REPETITIONS,
            oid: IF_STATUS_OID,
        });

        const candidateInterfaceIds = Object.entries(ifIDs)
            .map(([eachOid, eachResult]) => ({
                interfaceId: parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1), 10),
                state: eachResult,
            }))
            .filter(({ interfaceId, state }) => state < 3 && interfaceId < 1000)
            .map(({ interfaceId }) => interfaceId);

        const shortIdOids = candidateInterfaceIds.map((interfaceId) => `${IF_SHORT_ID_OID}.${interfaceId}`);
        const descriptionOids = candidateInterfaceIds.map((interfaceId) => `${IF_DESCRIPTION_OID}.${interfaceId}`);

        // Fetch additional details only for interfaces we actually keep.
        const [ifShortIDs, ifDescriptions] = await Promise.all([
            shortIdOids.length
                ? snmpAwait.getMultiple({
                    oids: shortIdOids,
                    ignoreMissing: true,
                    chunkSize: SNMP_CHUNK_SIZE,
                })
                : {},
            descriptionOids.length
                ? snmpAwait.getMultiple({
                    oids: descriptionOids,
                    ignoreMissing: true,
                    chunkSize: SNMP_CHUNK_SIZE,
                })
                : {},
        ]);

        const bulkOperations = [];

        for (const interfaceId of candidateInterfaceIds) {
            const shortId = ifShortIDs[`${IF_SHORT_ID_OID}.${interfaceId}`];
            const description = ifDescriptions[`${IF_DESCRIPTION_OID}.${interfaceId}`];

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

        if (bulkOperations.length > 0) {
            await interfacesCollection.bulkWrite(bulkOperations);
        }

        logger.debug(`updated db with ${bulkOperations.length} interface(s)`);
    } catch (err) {
        logger.warning(`interfaces task failed: ${err.stack || err.message || err}`);
        return;
    }
};
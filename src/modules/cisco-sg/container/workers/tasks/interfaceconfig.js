"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - waiting ...");
            return false;
        }

        const reads = [
            {
                name: "interface aliases",
                field: "alias",
                oid: "1.3.6.1.2.1.31.1.1.1.18",
                read: (oid) => snmpAwait.subtreeNext({ oid, maxIndexExclusive: 1000 }),
                convert: (value) => value,
            },
            {
                name: "interface admin state",
                field: "admin-state",
                oid: "1.3.6.1.2.1.2.2.1.7",
                read: (oid) => snmpAwait.getMultiple({
                    oids: interfaces.map(({ interfaceId }) => `${oid}.${interfaceId}`),
                    ignoreMissing: true,
                    chunkSize: 40,
                }),
                convert: (value) => value === 1,
            },
            {
                name: "PoE admin state",
                field: "poe-admin-enable",
                oid: "1.3.6.1.2.1.105.1.1.1.3.1",
                read: (oid) => snmpAwait.subtreeNext({ oid, maxIndexExclusive: 1000 }),
                convert: (value) => value === 1,
            },
        ];

        const fieldsByInterface = new Map(interfaces.map(({ interfaceId }) => [interfaceId, {}]));
        for (const { name, field, oid, read, convert } of reads) {
            try {
                const results = await read(oid);
                for (const { interfaceId } of interfaces) {
                    const key = `${oid}.${interfaceId}`;
                    if (Object.hasOwn(results, key)) {
                        fieldsByInterface.get(interfaceId)[field] = convert(results[key]);
                    }
                }
            } catch (error) {
                logger.warning(`failed to read ${name}: ${error.stack || error.message || error}`);
            }
        }

        const bulkOperations = [];
        for (const [interfaceId, fields] of fieldsByInterface) {
            if (!Object.keys(fields).length) continue;
            bulkOperations.push({
                updateOne: {
                    filter: {
                        interfaceId,
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
                    update: { $set: fields },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface configuration(s)`);
        }
    } catch (err) {
        logger.warning(`interfaceconfig task failed: ${err.stack || err.message || err}`);
    }
};

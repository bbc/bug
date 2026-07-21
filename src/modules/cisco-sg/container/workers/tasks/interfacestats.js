"use strict";

const logger = require("@core/logger")(module);
const formatBps = require("@core/format-bps");

const IN_OCTETS_OID = "1.3.6.1.2.1.2.2.1.10";
const OUT_OCTETS_OID = "1.3.6.1.2.1.2.2.1.16";

module.exports = async ({ snmpAwait, interfacesCollection, historyCollection }) => {
    try {
        const pollStartedAt = new Date();

        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces?.length) {
            logger.debug("no interfaces found in db - skipping update of interface stats");
            return;
        }

        const interfaceIds = interfaces.map((iface) => iface.interfaceId);
        const inOctetOids = interfaceIds.map((interfaceId) => `${IN_OCTETS_OID}.${interfaceId}`);
        const outOctetOids = interfaceIds.map((interfaceId) => `${OUT_OCTETS_OID}.${interfaceId}`);

        const [ifInOctets, ifOutOctets] = await Promise.all([
            inOctetOids.length
                ? snmpAwait.getMultiple({
                    oids: inOctetOids,
                    ignoreMissing: true,
                    chunkSize: 40,
                })
                : {},
            outOctetOids.length
                ? snmpAwait.getMultiple({
                    oids: outOctetOids,
                    ignoreMissing: true,
                    chunkSize: 40,
                })
                : {},
        ]);

        const sampleDate = new Date();
        const historyArray = [];
        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const fieldsToUpdate = {};

            const inOctets = ifInOctets[`${IN_OCTETS_OID}.${eachInterface.interfaceId}`];
            const outOctets = ifOutOctets[`${OUT_OCTETS_OID}.${eachInterface.interfaceId}`];

            if (inOctets === undefined || outOctets === undefined) {
                logger.debug(`interfacestats: missing counters for interface ${eachInterface.interfaceId}`);
                continue;
            }

            let rxRate = 0;
            let txRate = 0;

            if (eachInterface["stats-date"] !== undefined) {
                const previousMilliseconds = eachInterface["stats-date"].getTime();
                const currentMilliseconds = sampleDate.getTime();
                const differenceSeconds = (currentMilliseconds - previousMilliseconds) / 1000;

                if (differenceSeconds > 0) {
                    if (eachInterface["out-octets"] !== undefined) {
                        txRate = ((outOctets - eachInterface["out-octets"]) / differenceSeconds) * 8;
                    }
                    if (eachInterface["in-octets"] !== undefined) {
                        rxRate = ((inOctets - eachInterface["in-octets"]) / differenceSeconds) * 8;
                    }
                }
            }

            fieldsToUpdate["out-octets"] = outOctets;
            fieldsToUpdate["in-octets"] = inOctets;
            fieldsToUpdate["stats-date"] = sampleDate;
            fieldsToUpdate["tx-rate"] = txRate;
            fieldsToUpdate["rx-rate"] = rxRate;

            fieldsToUpdate["tx-history"] = eachInterface["tx-history"];
            fieldsToUpdate["rx-history"] = eachInterface["rx-history"];

            if (fieldsToUpdate["tx-history"] === undefined) {
                fieldsToUpdate["tx-history"] = [];
            } else {
                fieldsToUpdate["tx-history"].push({
                    value: txRate,
                    timestamp: sampleDate,
                });
                fieldsToUpdate["tx-history"] = fieldsToUpdate["tx-history"].slice(
                    Math.max(fieldsToUpdate["tx-history"].length - 20, 0)
                );
            }

            if (fieldsToUpdate["rx-history"] === undefined) {
                fieldsToUpdate["rx-history"] = [];
            } else {
                fieldsToUpdate["rx-history"].push({
                    value: rxRate,
                    timestamp: sampleDate,
                });
                fieldsToUpdate["rx-history"] = fieldsToUpdate["rx-history"].slice(
                    Math.max(fieldsToUpdate["rx-history"].length - 20, 0)
                );
            }

            fieldsToUpdate["tx-rate-text"] = formatBps(txRate);
            fieldsToUpdate["rx-rate-text"] = formatBps(rxRate);

            historyArray.push({
                id: eachInterface.interfaceId,
                "tx-rate": txRate,
                "rx-rate": rxRate,
            });

            bulkOperations.push({
                updateOne: {
                    filter: {
                        interfaceId: eachInterface.interfaceId,
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
                    update: { $set: fieldsToUpdate },
                    upsert: false,
                },
            });
        }

        logger.debug(`interfacestats: updating ${bulkOperations.length} interface(s)`);
        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface(s)`);
        }

        // save history
        let saveDocument = {
            timestamp: new Date(),
            interfaces: {},
        };

        for (let eachInterface of historyArray) {
            try {
                saveDocument.interfaces[eachInterface["id"]] = {
                    tx: eachInterface["tx-rate"],
                    rx: eachInterface["rx-rate"],
                };
            } catch (error) {
                logger.info(error);
            }
        }

        await historyCollection.insertOne(saveDocument);
        logger.debug(`saved history for ${historyArray.length} interface(s)`);

    } catch (err) {
        logger.warning(`interfacestats task failed: ${err.stack || err.message || err}`);
        return;
    }
};
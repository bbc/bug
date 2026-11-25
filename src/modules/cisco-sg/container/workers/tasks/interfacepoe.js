"use strict";

const logger = require("@core/logger")(module);

const convertPoeDescription = (value) => {
    switch (value) {
        case 1:
            return "None";
        case 2:
            return "802.3af PoE";
        case 3:
            return "802.at PoE+";
        case 4:
            return "60W PoE";
        case 5:
            return "802.3bt Type 3";
        case 6:
            return "802.3bt Type 4";
        default:
            return "";
    }
};

const convertPoePortType = (value) => {
    return value >= 2 && value <= 6;
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

        const statusProbe = await readDetails("PoE MIB layout", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.11.1", maxIndexExclusive: 1000 }));
        const probeValues = statusProbe ? Object.values(statusProbe) : [];
        // Legacy SG switches expose a time-range string at this OID; newer devices expose a TruthValue.
        const legacy = probeValues.length > 0 && probeValues.every((value) => typeof value === "string");
        const modern = probeValues.length > 0 && probeValues.every((value) => value === 1 || value === 2);
        if (statusProbe && !legacy && !modern) logger.warning("unable to determine PoE MIB layout");
        const operStatusOid = legacy ? "1.3.6.1.4.1.9.6.1.101.108.1.1.12.1" : "1.3.6.1.4.1.9.6.1.101.108.1.1.11.1";
        const rlPethPsePortOperStatus = legacy
            ? await readDetails("PoE operational state", () => snmpAwait.subtreeNext({ oid: operStatusOid, maxIndexExclusive: 1000 }))
            : modern ? statusProbe : null;
        const supportOid = legacy ? "1.3.6.1.4.1.9.6.1.101.108.1.1.14.1" : "1.3.6.1.4.1.9.6.1.101.108.1.1.13.1";
        const rlPethPsePortSupportPoeType = legacy || modern
            ? await readDetails("PoE type", () => snmpAwait.subtreeNext({ oid: supportOid, maxIndexExclusive: 1000 }))
            : null;
        const poePlusOid = "1.3.6.1.4.1.9.6.1.101.108.1.1.10.1";
        const poePlus = legacy
            ? await readDetails("PoE+ support", () => snmpAwait.subtreeNext({ oid: poePlusOid, maxIndexExclusive: 1000 }))
            : null;
        const rlPethPsePortOutputPower = await readDetails("PoE power", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.5.1", maxIndexExclusive: 1000 }));
        const rlPethPsePortStatusDescription = await readDetails("PoE status description", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.8.1", maxIndexExclusive: 1000 }));
        const rlPethPsePortStatus = await readDetails("PoE status", () => snmpAwait.subtreeNext({ oid: "1.3.6.1.4.1.9.6.1.101.108.1.1.7.1", maxIndexExclusive: 1000 }));

        logger.debug(`got PoE details for ${interfaces.length} interface(s) - updating db`);

        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const interfaceId = eachInterface.interfaceId;
            const fieldsToUpdate = {};
            const operStatus = rlPethPsePortOperStatus?.[`${operStatusOid}.${interfaceId}`];
            if (operStatus === 1 || operStatus === 2) fieldsToUpdate["poe-operational-status"] = operStatus === 1;
            if (rlPethPsePortSupportPoeType) {
                const poeTypeValue = rlPethPsePortSupportPoeType[`${supportOid}.${interfaceId}`];
                if (legacy && (poeTypeValue === 1 || poeTypeValue === 2)) {
                    fieldsToUpdate["poe-available"] = poeTypeValue === 1;
                    const plusValue = poePlus?.[`${poePlusOid}.${interfaceId}`];
                    if (poeTypeValue === 2) fieldsToUpdate["poe-description"] = "None";
                    else if (plusValue === 1) fieldsToUpdate["poe-description"] = "802.3at PoE+";
                    else if (plusValue === 2) fieldsToUpdate["poe-description"] = "802.3af PoE";
                } else if (modern && Number.isInteger(poeTypeValue) && poeTypeValue >= 1 && poeTypeValue <= 6) {
                    fieldsToUpdate["poe-available"] = convertPoePortType(poeTypeValue);
                    fieldsToUpdate["poe-description"] = convertPoeDescription(poeTypeValue);
                }
            }
            if (rlPethPsePortOutputPower) fieldsToUpdate["poe-power"] = rlPethPsePortOutputPower[`1.3.6.1.4.1.9.6.1.101.108.1.1.5.1.${interfaceId}`] ?? 0;
            if (rlPethPsePortStatusDescription) fieldsToUpdate["poe-port-status-description"] = rlPethPsePortStatusDescription[`1.3.6.1.4.1.9.6.1.101.108.1.1.8.1.${interfaceId}`] ?? "";
            if (rlPethPsePortStatus) fieldsToUpdate["poe-error"] = rlPethPsePortStatus[`1.3.6.1.4.1.9.6.1.101.108.1.1.7.1.${interfaceId}`] === 9;

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
                    update: { $set: fieldsToUpdate },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db for ${bulkResult.modifiedCount} interface PoE state(s)`);
        }
    } catch (err) {
        logger.warning(`interfacepoe task failed: ${err.stack || err.message || err}`);
        return;
    }
};

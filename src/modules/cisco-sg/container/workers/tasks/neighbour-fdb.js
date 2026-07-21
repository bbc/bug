"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle, interfacesCollection }) => {
    try {
        const pollStartedAt = new Date();

        // Fetch leases from db first so we can enrich MAC entries.
        const leases = await mongoSingle.get("leases");
        const leasesByMac = {};
        if (leases) {
            for (const lease of leases) {
                leasesByMac[lease.mac] = lease;
            }
        }

        const fbpOid = "1.3.6.1.2.1.17.4.3.1.2";
        const fdbList = await snmpAwait.subtree({
            oid: fbpOid,
            raw: true,
        });

        const fdbByInterface = [];

        for (let [eachOid, interfaceId] of Object.entries(fdbList)) {
            if (eachOid.indexOf(fbpOid) !== 0) {
                continue;
            }

            interfaceId = parseInt(interfaceId, 10);
            const macString = eachOid.substring(fbpOid.length + 1);
            const mac = snmpAwait.oidToMac(macString);

            if (!fdbByInterface[interfaceId]) {
                fdbByInterface[interfaceId] = [];
            }

            if (leasesByMac[mac]) {
                fdbByInterface[interfaceId].push(leasesByMac[mac]);
            } else {
                fdbByInterface[interfaceId].push({ mac });
            }
        }

        await Promise.all(
            fdbByInterface
                .map((fdbArray, eachIndex) => ({ fdbArray, eachIndex }))
                .filter(({ fdbArray }) => Array.isArray(fdbArray))
                .map(({ fdbArray, eachIndex }) => interfacesCollection.updateOne(
                    {
                        interfaceId: eachIndex,
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
                    { $set: { fdb: fdbArray } },
                    { upsert: false }
                ))
        );
    } catch (err) {
        logger.warning(`neighbour-fdb task failed: ${err.stack || err.message || err}`);
        return;
    }
};
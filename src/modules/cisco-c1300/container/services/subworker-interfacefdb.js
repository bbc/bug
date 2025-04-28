"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    // fetch leases from the db first - we merge this with the fetched MAC addresses to provide
    // more details to the user
    const leases = await mongoSingle.get("leases");
    const leasesByMac = {};
    if (leases) {
        for (const lease of leases) {
            leasesByMac[lease.mac] = lease;
        }
    }

    // fetch list of FDB (forwarding database) entries
    const fbpOid = `1.3.6.1.2.1.17.4.3.1.2`;
    const fdbList = await snmpAwait.subtree({
        oid: `1.3.6.1.2.1.17.4.3.1.2`,
        timeout: 30000,
    });

    const fdbByInterface = [];
    for (let [eachOid, interfaceId] of Object.entries(fdbList)) {
        if (eachOid.indexOf(fbpOid) === 0) {
            // interfaceId is an integer - convert it first
            interfaceId = parseInt(interfaceId);

            // the MAC address is formed from the last part of the OID
            // eg 1.3.6.1.2.17.4.3.1.2.0.1.192.34.4.195
            //                         ^^^^^^^^^^^^^^^^
            const macString = eachOid.substring(fbpOid.length + 1);
            const mac = snmpAwait.oidToMac(macString);

            // initialise the fdb object if it doesn't exist
            if (!fdbByInterface[interfaceId]) {
                fdbByInterface[interfaceId] = [];
            }

            // get info from the leases db
            if (leasesByMac[mac]) {
                fdbByInterface[interfaceId].push(leasesByMac[mac]);
            } else {
                fdbByInterface[interfaceId].push({
                    mac: mac,
                });
            }
        }
    }
    fdbByInterface.forEach(async (fdbArray, eachIndex) => {
        await interfacesCollection.updateOne(
            { interfaceId: eachIndex },
            {
                $set: {
                    fdb: fdbArray,
                },
            },
            { upsert: false }
        );
    });
};

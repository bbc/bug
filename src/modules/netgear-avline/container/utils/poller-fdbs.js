"use strict";

const mongoSingle = require("@core/mongo-single");

const entryTypes = {
    "0": "Static",
    "1": "Learned",
    "2": "Management",
    "3": "GMRP Learned",
    "4": "Self",
    "5": "Dot1x Static",
    "6": "Dot1ag Static",
    "7": "Routing Intf address",
    "8": "Address is learned, but not guaranteed to be in HW (relevant for SW learning)",
    "9": "FIP Snooping Learned",
    "10": "CP client MAC Address",
    "11": "ethcfm Static",
    "12": "Y.1731 Static",
}

module.exports = async (NetgearApi, interfacesCollection) => {

    // fetch leases from the db first - we merge this with the fetched MAC addresses to provide
    // more details to the user
    const leases = await mongoSingle.get("leases");
    const leasesByMac = {};
    if (leases) {
        for (const lease of leases) {
            leasesByMac[lease.mac] = lease;
        }
    }

    const fdbByInterface = {};

    // fetch FDB info
    const result = await NetgearApi.get({ path: "fdbs" });
    if (result) {
        for (let eachEntry of result?.fdb_entries) {
            if (!fdbByInterface[eachEntry.interface]) {
                fdbByInterface[eachEntry.interface] = [];
            }
            const matchingLease = leasesByMac[eachEntry.mac];
            fdbByInterface[eachEntry.interface].push({
                "vlanId": eachEntry.vlanId,
                entryType: entryTypes[eachEntry.entryType],
                mac: eachEntry.mac,
                address: matchingLease?.address ?? "",
                hostname: matchingLease?.hostname ?? "",
                comment: matchingLease?.comment ?? "",
            });
        }
    }

    // save to db
    for (let [port, fdbArray] of Object.entries(fdbByInterface)) {
        await interfacesCollection.updateOne(
            { port: parseInt(port) },
            {
                $set: {
                    fdb: fdbArray,
                },
            },
            { upsert: false }
        );
    }

};

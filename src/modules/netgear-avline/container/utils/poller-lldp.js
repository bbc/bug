"use strict";

const mongoSingle = require("@core/mongo-single");

const types = {
    "1": "Chassis component",
    "2": "Interface alias",
    "3": "Port component",
    "4": "MAC address",
    "5": "Network address",
    "6": "Interface",
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

    const lldpByInterface = {};

    // fetch LLDP info
    const result = await NetgearApi.get({ path: "lldp_remote_devices" });
    if (result) {
        for (let eachDevice of result?.lldp_remote_devices) {
            const matchingLease = leasesByMac[eachDevice.chassisId];
            lldpByInterface[eachDevice.id] = {
                chassisId: eachDevice.chassisId,
                chassisType: types[eachDevice.chassisIdSubtype],
                remotePortId: eachDevice.remotePortId,
                remotePortType: types[eachDevice.remotePortIdSubtype],
                remotePortDesc: eachDevice.remotePortDesc,
                remoteSysName: eachDevice.remoteSysName,
                remoteSysDesc: eachDevice.remoteSysDesc,
                address: matchingLease?.address ?? "",
                hostname: matchingLease?.hostname ?? "",
                comment: matchingLease?.comment ?? "",
            }
        }
    }

    // save to db
    for (let [port, lldpObject] of Object.entries(lldpByInterface)) {
        await interfacesCollection.updateOne(
            { port: parseInt(port) },
            {
                $set: {
                    lldp: lldpObject,
                },
            },
            { upsert: false }
        );
    }

};

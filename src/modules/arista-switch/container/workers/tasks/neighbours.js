"use strict";

const parseHex = require("@utils/arista-parsehex");
const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, mongoSingle, interfacesCollection, workerData }) => {
    try {
        // fetch ARP neighbors
        const arpResult = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show arp"],
        });

        // fetch leases once
        const leases = await mongoSingle.get("leases") || [];
        const leasesByMac = Object.fromEntries(leases.map(lease => [lease.mac, lease]));

        // process ARP / FDB-like info
        const arpByInterface = {};
        (arpResult?.ipV4Neighbors || []).forEach(eachArp => {
            const mac = parseHex(eachArp.hwAddress).toUpperCase();
            const interfaceArray = eachArp.interface.split(", ");
            interfaceArray.forEach(iface => {
                if (!arpByInterface[iface]) arpByInterface[iface] = [];
                arpByInterface[iface].push(leasesByMac[mac] || { mac });
            });
        });

        // bulk update ARP info
        const arpOps = Object.entries(arpByInterface).map(([interfaceId, data]) => ({
            updateOne: {
                filter: { interfaceId },
                update: { $set: { fdb: data } },
                upsert: false
            }
        }));
        if (arpOps.length) await interfacesCollection.bulkWrite(arpOps);
        logger.debug(`updated db with arp details for ${arpOps.length} interface(s)`);

        // fetch LLDP neighbors
        const lldpResult = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show lldp neighbors"],
        });

        // process LLDP info
        const lldpByInterface = {};
        (lldpResult?.lldpNeighbors || []).forEach(eachNeighbor => {
            const interfaceId = eachNeighbor.port;
            if (!lldpByInterface[interfaceId]) lldpByInterface[interfaceId] = {};

            lldpByInterface[interfaceId].name = eachNeighbor.neighborDevice;

            const macAddress = parseHex(eachNeighbor.neighborPort).toUpperCase();
            if (macAddress !== eachNeighbor.neighborPort) {
                const lease = leasesByMac[macAddress];
                lldpByInterface[interfaceId].port = "";
                lldpByInterface[interfaceId].mac = macAddress;
                lldpByInterface[interfaceId].address = lease?.address || "";
            } else {
                lldpByInterface[interfaceId].port = eachNeighbor.neighborPort;
                lldpByInterface[interfaceId].mac = "";
                lldpByInterface[interfaceId].address = "";
            }
        });

        // bulk update LLDP info
        const lldpOps = Object.entries(lldpByInterface).map(([interfaceId, data]) => ({
            updateOne: {
                filter: { interfaceId },
                update: { $set: { lldp: data } },
                upsert: false
            }
        }));
        if (lldpOps.length) await interfacesCollection.bulkWrite(lldpOps);
        logger.debug(`updated db with lldp details for ${lldpOps.length} interface(s)`);


    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
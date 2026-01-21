"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");
const leaseLabel = require("@utils/lease-label");

module.exports = async (lease) => {
    // check for missing data before connecting
    if (!lease || !lease.address || !lease.macAddress) {
        throw new Error("missing required lease data (address or macaddress)");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        // get the list of leases first
        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const newComment = leaseLabel.stringify({ ...lease, isManaged: true });

        // check if mac address is in db
        const existingMacIndex = dbLeases.findIndex((li) => li.macAddress === lease?.macAddress);

        if (existingMacIndex > -1) {
            // it's an update to the existing item
            console.log(`dhcplease-add: updating existing item with mac address ${lease.macAddress}`);

            const existingLease = dbLeases[existingMacIndex];

            await conn.write(`/ip/dhcp-server/lease/set`, [
                `=.id=${existingLease.id}`,
                `=comment=${newComment}`,
                `=address=${lease.address}`,
                `=server=${lease.dhcpServer}`
            ]);

            // update local cache 
            dbLeases[existingMacIndex] = {
                ...existingLease,
                address: lease.address,
                comment: newComment,
                dhcpServer: lease.dhcpServer,
                group: lease.group,
                label: lease.label,
                isManaged: true
            };
        } else {
            // it's a new item - check if the address is already taken
            const existingIp = dbLeases.findIndex((li) => li.address === lease?.address);
            if (existingIp > -1) {
                throw new Error(`a reservation already exists for ip ${lease.address}`);
            }

            // creating a new item requires the add command
            console.log(`dhcplease-add: creating new reservation for ${lease.macAddress}`);

            await conn.write(`/ip/dhcp-server/lease/add`, [
                `=comment=${newComment}`,
                `=address=${lease.address}`,
                `=mac-address=${lease.macAddress}`,
                `=server=${lease.dhcpServer}`
            ]);

            // add the new entry to local cache
            dbLeases.push({
                macAddress: lease.macAddress,
                address: lease.address,
                comment: newComment,
                dhcpServer: lease.dhcpServer,
                group: lease.group,
                label: lease.label,
                isManaged: true
            });
        }

        // save the updated list back to the database
        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`dhcplease-add: ${error.message}`);
        throw error;
    } finally {
        // ensure connection always closes
        if (conn) conn.close();
    }
};
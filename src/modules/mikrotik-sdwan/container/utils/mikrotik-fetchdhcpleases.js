"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const leaseLabel = require("@utils/lease-label");

module.exports = async (conn) => {
    // ensure the connection exists to prevent calling .write on null
    if (!conn) {
        throw new Error("mikrotik-fetchdhcpleases: no connection provided");
    }

    try {
        // fetch all dhcp leases from the mikrotik router
        const data = await conn.write("/ip/dhcp-server/lease/getall");

        // if the router returns something that isn't an array, it's a failure
        if (!data || !Array.isArray(data)) {
            throw new Error("mikrotik-fetchdhcpleases: invalid response from router");
        }

        // process and normalize lease data in a single map operation
        return data.map((item) => {
            // parse raw api result into typed fields
            const lease = mikrotikParseResults({
                result: item,
                booleanFields: ["radius", "dynamic", "blocked", "disabled"],
                timeFields: ["expires-after", "last-seen"],
                arrayFields: ["address-lists"]
            });

            // extract label information from the comment field
            const parsedLabel = leaseLabel.parse(lease.comment);

            // return clean object with camelcase keys
            return {
                ...parsedLabel,
                address: lease.address,
                macAddress: lease["mac-address"],
                hostName: lease["host-name"],
                dynamic: lease.dynamic,
                clientId: lease["client-id"],
                disabled: lease.disabled,
                lastSeen: lease["last-seen"],
                addressLists: lease["address-lists"],
                comment: lease.comment,
                server: lease.server,
                status: lease.status,
                id: lease.id
            };
        });

    } catch (error) {
        // log and re-throw so the worker loop catches the failure and exits
        console.error(`mikrotik-fetchdhcpleases error: ${error.message}`);
        throw error;
    }
};
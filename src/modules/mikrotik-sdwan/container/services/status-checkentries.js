
'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {

    try {
        // fetch data in parallel including the config for lock status
        const [dbDhcpLeases, config] = await Promise.all([
            mongoSingle.get('dhcpLeases'),
            configGet()
        ]);

        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        // filter for managed leases immediately
        const managedLeases = (dbDhcpLeases || []).filter(d => d.isManaged === true);

        if (!managedLeases || managedLeases.length === 0) {
            return [
                new StatusItem({
                    key: `noleases`,
                    message: "No SDWAN entries configured",
                    type: "info",
                    flags: [],
                }),
            ];

        }

        return [
            new StatusItem({
                key: `leasesfound`,
                message: `${managedLeases.length} SDWAN entries configured`,
                type: "default",
                flags: [],
            }),
        ];

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`status-checkentries: ${error.message}`);
        throw error;
    }
};
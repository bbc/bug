
'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        // fetch data in parallel including the config for lock status
        const [dbDhcpLeases, config] = await Promise.all([
            mongoSingle.get('dhcpLeases'),
            configGet()
        ]);

        if (!config) {
            return []
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

    } catch (err) {
        logger.error(`status-checkentries: ${err.stack || err.message}`);
        return [];
    }
};
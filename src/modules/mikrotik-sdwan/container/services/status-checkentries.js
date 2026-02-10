
'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        const [dbTables, dbDhcpLeases, config] = await Promise.all([
            mongoSingle.get('routingTables'),
            mongoSingle.get('dhcpLeases'),
            configGet()
        ]);

        if (!config) {
            return []
        }

        const managedLeases = (dbDhcpLeases || []).filter(d => d.isManaged === true);
        const prefix = config.routingTablePrefix;
        const managedTables = (dbTables || []).filter(table => table.name?.startsWith(prefix) && !table.disabled && table.comment)
        const entryText = managedLeases.length === 1 ? "entry" : "entries";

        return new StatusItem({
            message: `Device active with ${managedLeases.length} ${entryText} and ${managedTables.length} WAN(s) defined`,
            key: "defaultservice",
            type: "default",
            flags: [],
        })


    } catch (err) {
        logger.error(`status-checkentries: ${err.stack || err.message}`);
        return [];
    }
};
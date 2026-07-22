
'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const [dbTables, dbDhcpLeases, dbListItems, config] = await Promise.all([
            mongoSingle.get('routingTables'),
            mongoSingle.get('dhcpLeases'),
            mongoSingle.get('listItems'),
            configGet()
        ]);

        if (!config?.routingTablePrefix) {
            return [];
        }

        const prefix = config.routingTablePrefix;
        const managedEntries = (dbListItems || []).filter((item) =>
            item?.comment?.toLowerCase().includes("[bug_sdwan]")
        );
        const managedTables = (dbTables || []).filter(
            (table) => table.name?.startsWith(prefix) && !table.disabled && table.comment
        );
        const entryText = managedEntries.length === 1 ? "entry" : "entries";

        return new StatusItem({
            message: `Device active with ${managedEntries.length} ${entryText} and ${managedTables.length} WAN(s) defined`,
            key: "defaultservice",
            type: "default",
            flags: [],
        });

    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};
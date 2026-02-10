'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async () => {
    const ungroupedLabel = "UNGROUPED";

    try {
        // fetch data in parallel including the config for lock status
        const [dbListItems, dbDhcpLeases, config] = await Promise.all([
            mongoSingle.get('listItems'),
            mongoSingle.get('dhcpLeases'),
            configGet()
        ]);

        // if config is missing, we cannot determine lock status or prefixes
        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        // create a set for fast lookup of locked addresses
        const lockedAddresses = new Set(config?.lockedEntries || []);

        // filter for managed leases immediately
        const managedLeases = (dbDhcpLeases || []).filter(d => d.isManaged === true);

        // return empty array if no managed leases exist
        if (dbDhcpLeases?.length === 0) return [];

        // create a map for list items metadata
        const listItemMap = new Map(dbListItems?.map(i => [i.address, i]));

        // group the managed entries using the properties on the lease
        const groupedEntries = managedLeases.reduce((acc, dhcp) => {
            // force the group name to uppercase and trim whitespace
            const groupKey = (dhcp.group || ungroupedLabel).trim().toUpperCase();

            if (!acc[groupKey]) {
                acc[groupKey] = { group: groupKey, items: [] };
            }

            const dbItem = listItemMap.get(dhcp.address);

            acc[groupKey].items.push({
                address: dhcp.address,
                label: dhcp.label,
                group: dhcp.group,
                list: dbItem?.list ?? null,
                comment: dbItem?.comment,
                listItemId: dbItem?.id,
                static: dhcp.clientId ? false : true,
                macAddress: dhcp.macAddress,
                hostName: dhcp.hostName,
                lastSeen: dhcp.lastSeen,
                dhcpStatus: dhcp.status,
                dhcpId: dhcp.id,
                isLocked: lockedAddresses.has(dhcp.address)
            });

            return acc;
        }, {});

        // convert to array and sort items within each group
        return Object.values(groupedEntries)
            // sort groups by name, UNGROUPED last
            .sort((a, b) => {
                if (a.group === ungroupedLabel) return 1;
                if (b.group === ungroupedLabel) return -1;

                return a.group.localeCompare(b.group, undefined, {
                    sensitivity: 'base'
                });
            })
            // then sort items within each group
            .map(group => {
                group.items.sort((a, b) =>
                    a.label.localeCompare(b.label, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    })
                );
                return group;
            });

    } catch (err) {
        err.message = `entry-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
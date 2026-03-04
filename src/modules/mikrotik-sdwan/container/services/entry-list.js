'use strict';

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const commentParser = require("@utils/comment-parser");

module.exports = async () => {
    const ungroupedLabel = "UNGROUPED";

    try {
        // fetch data in parallel including the config for lock status
        const [dbListItems, dbDhcpLeases, config] = await Promise.all([
            mongoSingle.get('listItems'),
            mongoSingle.get('dhcpLeases'),
            configGet()
        ]);

        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        const lockedAddresses = new Set(config?.lockedEntries || []);
        const managedEntries = (dbListItems || []).filter(item => item.comment?.includes("[bug_sdwan]"));

        const groupedEntries = managedEntries.reduce((acc, item) => {
            const parsedLabel = commentParser.parse(item.comment);
            const groupKey = (parsedLabel.group || ungroupedLabel)
                .trim()
                .toUpperCase();
            if (!acc[groupKey]) {
                acc[groupKey] = { group: groupKey, items: [] };
            }

            const list = item.list === "none" ? null : item.list;

            const dhcpLease = dbDhcpLeases.find((l) => l.address === item.address);

            acc[groupKey].items.push({
                ...parsedLabel,
                address: item.address,
                list,
                comment: item.comment,
                listItemId: item.id,
                static: true,
                hostName: null,
                lastSeen: null,
                macAddress: dhcpLease?.macAddress,
                server: dhcpLease?.server,
                dhcpDynamic: dhcpLease?.dynamic ?? false,
                isLocked: lockedAddresses.has(item.address),
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
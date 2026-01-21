"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckEntries = require("./status-checkentries");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "dhcpNetworks",
            message: ["There are no DHCP networks defined in the router"],
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckMongoSingle({
            collectionName: "dhcpServers",
            message: ["There are no DHCP servers defined in the router"],
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckMongoSingle({
            collectionName: "routingTables",
            message: ["There are no routing tables defined in the router"],
            itemType: "warning",
            timeoutSeconds: 60,
        }),
        await statusCheckEntries()
    );
};

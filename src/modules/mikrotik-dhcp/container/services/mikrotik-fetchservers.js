"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    var data = await conn.write("/ip/dhcp-server/getall");

    // process data
    var servers = [];
    for (var i in data) {
        servers.push(
            mikrotikParseResults({
                result: data[i],
                booleanFields: ["authoritative", "use-radius", "dynamic", "invalid", "disabled"],
                timeFields: ["lease-time"],
            })
        );
    }
    return servers;
};

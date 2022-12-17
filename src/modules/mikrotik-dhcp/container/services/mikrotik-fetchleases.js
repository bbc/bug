"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    var data = await conn.write("/ip/dhcp-server/lease/getall");
    // process data
    var leases = [];

    for (var i in data) {
        leases.push(
            mikrotikParseResults({
                result: data[i],
                booleanFields: ["radius", "dynamic", "blocked", "disabled"],
                timeFields: ["expires-after", "last-seen"],
                arrayFields: ["address-lists"]
            })
        );
    }

    return leases;
};

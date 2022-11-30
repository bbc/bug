"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    var data = await conn.write("/ip/route/print");

    // process data
    var interfaces = [];
    for (var i in data) {
        interfaces.push(
            mikrotikParseResults({
                result: data[i],
                integerFields: ["distance", "scope", "target-scope", "route-tag", "ospf-metric"],
                booleanFields: ["active", "dynamic", "static", "ospf", "disabled", "blackhole"],
                timeFields: [],
            })
        );
    }
    return interfaces;
};

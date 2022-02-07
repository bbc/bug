"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    var data = await conn.write("/ip/neighbor/print");

    // process data
    var lldpItems = [];
    for (var i in data) {
        lldpItems.push(
            mikrotikParseResults({
                result: data[i],
                arrayFields: ["interface"],
                integerFields: [],
                booleanFields: [],
                timeFields: ["uptime"],
            })
        );
    }
    return lldpItems;
};

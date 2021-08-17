"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {
    var data = await conn.write("/ip/firewall/filter/getall");

    // process data
    const addressListUniqueObject = {};
    for (var i in data) {
        if (data[i]['address-list']) {
            const val = data[i]['address-list'];
            addressListUniqueObject[val] = val;
        }
    }

    return Object.values(addressListUniqueObject);
};

"use strict";

const mikrotikConnect = require("../utils/mikrotik-connect");

module.exports = async (params) => {
    const conn = await mikrotikConnect();
    if (!conn) {
        return;
    }

    const paramArray = [
        `=address=${params.address}`,
        `=mac-address=${params['mac-address']}`,
        `=disabled=${params.disabled ? "yes" : "no"}`,
    ];

    if (params.server && params.server !== "all") {
        paramArray.push(`=server=${params.server}`)
    }

    if (params['address-lists'] && params['address-lists'].length > 0) {
        paramArray.push(`=address-lists=${params['address-lists'].join(",")}`);
    }

    if (params.comment) {
        paramArray.push(`=comment=${params.comment}`)
    }

    try {
        await conn.write("/ip/dhcp-server/lease/add", paramArray);
        console.log(`mikrotik-leaseadd: added lease for address ${params.address}`);
        conn.close();
        return true;
    } catch (error) {
        console.log(`mikrotik-leaseadd: ${error.stack || error.trace || error || error.message}`);
        conn.close();
        return false;
    }
};

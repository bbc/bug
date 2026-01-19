"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (address, list) => {
    // ensure address is provided to prevent logic errors
    if (!address || address === "undefined") {
        throw new Error("no address provided to set route");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        const dbListItems = await mongoSingle.get('listItems') || [];
        const existingIndex = dbListItems.findIndex((li) => li.address === address);

        if (existingIndex !== -1) {
            // update existing
            const item = dbListItems[existingIndex];
            console.log(`entry-setroute: updating ${address} to list '${list}'`);

            await conn.write(`/ip/firewall/address-list/set`, [
                `=numbers=${item.id}`,
                `=list=${list}`
            ]);

            dbListItems[existingIndex].list = list;
        } else {
            // add new item
            console.log(`entry-setroute: creating new entry for ${address} in list '${list}'`);

            // add to mikrotik and capture the new id
            const result = await conn.write(`/ip/firewall/address-list/add`, [
                `=address=${address}`,
                `=list=${list}`,
                '=comment=[bug_sdwan]'
            ]);

            // mikrotik usually returns the new id in the format [{ ret: "*1a" }]
            const newId = result[0]?.ret;

            // push new object to our local array
            dbListItems.push({
                id: newId,
                address: address,
                list: list
            });
        }

        // save the updated array back to mongo
        await mongoSingle.set('listItems', dbListItems);

        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`entry-setroute: ${error.message}`);
        throw error;
    } finally {
        // ensure connection always closes regardless of success or failure
        if (conn) conn.close();
    }
};
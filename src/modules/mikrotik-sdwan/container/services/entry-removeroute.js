"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (address) => {
    // ensure address is provided to prevent logic errors
    if (!address || address === "undefined") {
        throw new Error("no address provided for route removal");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        const dbListItems = await mongoSingle.get('listItems') || [];

        // find all entries matching the specific address
        const itemsToRemove = dbListItems.filter(li => li.address === address);

        if (itemsToRemove.length === 0) {
            console.log(`entry-removeroute: no entries found for ${address}`);
            return true;
        }

        // remove each matching entry from the mikrotik router
        for (const item of itemsToRemove) {
            console.log(`entry-removeroute: removing ${address} from list '${item.list}'`);

            await conn.write("/ip/firewall/address-list/remove", [
                `=.id=${item.id}`
            ]);
        }

        // update the local database by filtering out the removed address
        const updatedListItems = dbListItems.filter(li => li.address !== address);
        await mongoSingle.set('listItems', updatedListItems);
        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        console.error(`entry-removeroute error: ${error.message}`);
        throw error;
    } finally {
        // ensure connection always closes regardless of success or failure
        if (conn) conn.close();
    }
};
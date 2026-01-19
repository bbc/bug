"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");

module.exports = async (address) => {
    // ensure address is provided
    if (!address || address === "undefined") {
        throw new Error("no address provided to delete route");
    }

    const conn = await mikrotikConnect();
    if (!conn) throw new Error("could not connect to mikrotik router");

    try {
        const dbListItems = await mongoSingle.get('listItems') || [];
        const existingIndex = dbListItems.findIndex((li) => li.address === address);

        if (existingIndex !== -1) {
            const item = dbListItems[existingIndex];
            console.log(`entry-deleteroute: removing ${address} (ID: ${item.id}) from Mikrotik`);

            // remove from mikrotik using the id stored in mongo
            await conn.write(`/ip/firewall/address-list/remove`, [
                `=numbers=${item.id}`
            ]);

            // filter out the deleted item from our local array
            const updatedListItems = dbListItems.filter((li) => li.address !== address);

            // save the pruned array back to mongo
            await mongoSingle.set('listItems', updatedListItems);

            console.log(`entry-deleteroute: ${address} successfully deleted.`);
            return true;
        } else {
            console.log(`entry-deleteroute: ${address} not found in database, nothing to delete.`);
            return false;
        }

    } catch (error) {
        console.error(`entry-deleteroute error: ${error.message}`);
        throw error;
    } finally {
        if (conn) conn.close();
    }
};
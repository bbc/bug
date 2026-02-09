"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (address) => {
    let conn;

    try {
        // ensure address is provided
        if (!address || address === "undefined") {
            throw new Error("no address provided to delete route");
        }

        conn = await mikrotikConnect();
        if (!conn) throw new Error("could not connect to mikrotik router");

        const dbListItems = await mongoSingle.get('listItems') || [];
        const existingIndex = dbListItems.findIndex((li) => li.address === address);

        if (existingIndex !== -1) {
            const item = dbListItems[existingIndex];
            logger.info(`entry-deleteroute: removing ${address} (id: ${item.id}) from router`);

            await conn.write(`/ip/firewall/address-list/remove`, [
                `=numbers=${item.id}`
            ]);

            // filter out the deleted item from our local array
            const updatedListItems = dbListItems.filter((li) => li.address !== address);

            // save the pruned array back to mongo
            await mongoSingle.set('listItems', updatedListItems);

            logger.info(`entry-deleteroute: ${address} successfully deleted.`);
            return true;
        } else {
            logger.info(`entry-deleteroute: ${address} not found in database, nothing to delete.`);
            return false;
        }

    } catch (err) {
        err.message = `entry-deleteroute: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (conn) conn.close();
    }
};
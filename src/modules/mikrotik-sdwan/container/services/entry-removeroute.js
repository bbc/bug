"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (address) => {

    let conn;

    try {

        if (!address || address === "undefined") {
            throw new Error("no address provided for route removal");
        }

        conn = await mikrotikConnect();
        if (!conn) throw new Error("could not connect to mikrotik router");

        const dbListItems = await mongoSingle.get('listItems') || [];

        const itemsToRemove = dbListItems.filter(li => li.address === address);

        if (itemsToRemove.length === 0) {
            logger.info(`entry-removeroute: no entries found for ${address}`);
            return true;
        }

        // remove each matching entry from the mikrotik router
        for (const item of itemsToRemove) {
            logger.info(`entry-removeroute: removing ${address} from list '${item.list}'`);

            await conn.write("/ip/firewall/address-list/remove", [
                `=.id=${item.id}`
            ]);
        }

        // update the local database by filtering out the removed address
        const updatedListItems = dbListItems.filter(li => li.address !== address);
        await mongoSingle.set('listItems', updatedListItems);
        return true;

    } catch (err) {
        err.message = `entry-removeroute: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (conn) conn.close();
    }
};
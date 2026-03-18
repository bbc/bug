"use strict";

const mongoSingle = require("@core/mongo-single");
const commentParser = require("@utils/comment-parser");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (entry) => {

    try {
        // check for missing data before connecting
        if (!entry || !entry.address) {
            throw new Error("missing required entry data (address or macaddress)");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const routerOsApi = new RouterOSApi({
            host: config.address,
            user: config.username,
            password: config.password,
            timeout: 10,
        });

        // get the list of items first
        const dbListItems = await mongoSingle.get('listItems') || [];
        const newComment = commentParser.stringify({ ...entry, isManaged: true });

        // check if entry already exists in db
        const existingEntry = dbListItems.find((i) => i.address === entry.address && i.isManaged)
        if (existingEntry) {
            throw new Error(`entry ${entry.address} already exists`);
        }

        // creating a new item requires the add command
        logger.info(`entry-add: creating new entry for ${entry.address}`);

        // we just set the list to 'none' to keep it in the list
        await routerOsApi.run(`/ip/firewall/address-list/add`, [
            `=comment=${newComment}`,
            `=address=${entry.address}`,
            `=list=none`
        ]);

        // add the new entry to local cache
        dbListItems.push({
            address: entry.address,
            comment: newComment,
            dynamic: false,
            list: "none"
        });

        // save the updated list back to the database
        await mongoSingle.set('listItems', dbListItems);

        return true;

    } catch (err) {
        err.message = `entry-add: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
}
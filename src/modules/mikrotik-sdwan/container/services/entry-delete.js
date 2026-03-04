"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (address) => {

    try {
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

        // ensure address is provided to prevent logic errors
        if (!address || address === "undefined") {
            throw new Error("no address provided for entry removal");
        }

        // get the list of items first
        const dbListItems = await mongoSingle.get('listItems') || [];
        const entryIndex = dbListItems.findIndex((li) => li.address === address);

        if (entryIndex === -1) {
            throw new Error(`entry with address ${address} not found in database`);
        }

        // update the mikrotik router to clear the comment
        await routerOsApi.run(`/ip/firewall/address-list/remove`, [
            `=numbers=${dbListItems[entryIndex].id}`,
        ]);

        // save the updated list back to the database
        console.log(dbListItems.filter((i) => i.address !== dbListItems[entryIndex].address));
        await mongoSingle.set('listItems', dbListItems.filter((i) => i.address !== dbListItems[entryIndex].address));

        return true;

    } catch (err) {
        err.message = `entry-delete: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
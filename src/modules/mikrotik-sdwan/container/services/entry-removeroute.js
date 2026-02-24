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

        const dbListItems = await mongoSingle.get('listItems') || [];

        const itemsToRemove = dbListItems.filter(li => li.address === address);

        if (itemsToRemove.length === 0) {
            logger.info(`entry-removeroute: no entries found for ${address}`);
            return true;
        }

        // remove each matching entry from the mikrotik router
        for (const item of itemsToRemove) {
            logger.info(`entry-removeroute: removing ${address} from list '${item.list}'`);

            await routerOsApi.run("/ip/firewall/address-list/remove", [
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
    }
};
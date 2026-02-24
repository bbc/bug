"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (address, list) => {

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

        if (!address || address === "undefined") {
            throw new Error("no address provided to set route");
        }

        const dbListItems = await mongoSingle.get('listItems') || [];
        const existingIndex = dbListItems.findIndex((li) => li.address === address);

        if (existingIndex !== -1) {
            // update existing
            const item = dbListItems[existingIndex];
            logger.info(`entry-setroute: updating ${address} to list '${list}'`);

            await routerOsApi.run(`/ip/firewall/address-list/set`, [
                `=numbers=${item.id}`,
                `=list=${list}`
            ]);

            dbListItems[existingIndex].list = list;
        } else {
            // add new item
            logger.info(`entry-setroute: creating new entry for ${address} in list '${list}'`);

            // add to mikrotik and capture the new id
            const result = await routerOsApi.run(`/ip/firewall/address-list/add`, [
                `=address=${address}`,
                `=list=${list}`,
                '=comment=[bug_sdwan]'
            ]);

            // mikrotik usually returns the new id in the format [{ ret: "*1a" }]
            const newId = result[0]?.ret;

            if (newId) {
                // push new object to our local array
                dbListItems.push({
                    id: newId,
                    address: address,
                    list: list
                });
            }
        }

        // save the updated array back to mongo
        await mongoSingle.set('listItems', dbListItems);

        return true;

    } catch (err) {
        err.message = `entry-setroute: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
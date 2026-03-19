"use strict";

const mongoSingle = require("@core/mongo-single");
const commentParser = require("@utils/comment-parser");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (address, group) => {

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
            throw new Error("no address provided to set group");
        }

        const dbListItems = await mongoSingle.get('listItems') || [];
        const existingIndex = dbListItems.findIndex((li) => li.address === address && li.isManaged);

        if (existingIndex === -1) {
            throw new Error(`address ${address} not found`);
        }

        const entry = dbListItems[existingIndex];

        // update existing
        logger.info(`entry-setlabel: setting group for ${address} to '${group}'`);
        const newEntry = { ...entry, group: group }
        const newComment = commentParser.stringify(newEntry);

        await routerOsApi.run(`/ip/firewall/address-list/set`, [
            `=numbers=${entry.id}`,
            `=comment=${newComment}`
        ]);

        // update db item
        dbListItems[existingIndex].comment = newComment;
        dbListItems[existingIndex].group = group;

        await mongoSingle.set('listItems', dbListItems);

        return true;

    } catch (err) {
        err.message = `entry-setgroup: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
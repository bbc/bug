"use strict";

const mongoSingle = require("@core/mongo-single");
const leaseLabel = require("@utils/lease-label");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (address, label) => {

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
            throw new Error("no address provided to set label");
        }

        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const existingIndex = dbLeases.findIndex((li) => li.address === address);

        if (existingIndex === -1) {
            throw new Error(`address ${address} not found`);
        }

        const lease = dbLeases[existingIndex];

        // update existing
        logger.info(`entry-setlabel: renaming ${address} to '${label}'`);
        const newEntry = { ...lease, label: label }
        const newComment = leaseLabel.stringify(newEntry);

        await routerOsApi.run(`/ip/dhcp-server/lease/set`, [
            `=numbers=${lease.id}`,
            `=comment=${newComment}`
        ]);

        // update db item
        dbLeases[existingIndex].comment = newComment;
        dbLeases[existingIndex].label = label;

        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (err) {
        err.message = `entry-setlabel: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
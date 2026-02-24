"use strict";

const mongoSingle = require("@core/mongo-single");
const leaseLabel = require("@utils/lease-label");
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

        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const existingIndex = dbLeases.findIndex((li) => li.address === address);

        if (existingIndex === -1) {
            throw new Error(`address ${address} not found`);
        }

        const lease = dbLeases[existingIndex];

        // update existing
        logger.info(`entry-setgroup: setting group for ${address} to '${group}'`);
        const newEntry = { ...lease, group: group }
        const newComment = leaseLabel.stringify(newEntry);

        await routerOsApi.run(`/ip/dhcp-server/lease/set`, [
            `=numbers=${lease.id}`,
            `=comment=${newComment}`
        ]);

        // update db item
        dbLeases[existingIndex].comment = newComment;
        dbLeases[existingIndex].group = group;

        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (err) {
        err.message = `entry-setgroup: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
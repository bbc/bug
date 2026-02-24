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
            throw new Error("no address provided for lease removal");
        }

        // get the list of leases first
        const dbLeases = await mongoSingle.get('dhcpLeases') || [];
        const leaseIndex = dbLeases.findIndex((li) => li.address === address);

        if (leaseIndex === -1) {
            throw new Error(`lease with address ${address} not found in database`);
        }

        const targetLease = dbLeases[leaseIndex];

        // update the mikrotik router to clear the comment
        await routerOsApi.run(`/ip/dhcp-server/lease/set`, [
            `=.id=${targetLease.id}`,
            `=comment=`
        ]);

        // update local cache for consistency and flag as unmanaged
        dbLeases[leaseIndex].comment = "";
        dbLeases[leaseIndex].group = "";
        dbLeases[leaseIndex].label = "";
        dbLeases[leaseIndex].isManaged = false;

        // save the updated list back to the database
        await mongoSingle.set('dhcpLeases', dbLeases);

        return true;

    } catch (err) {
        err.message = `dhcplease-delete: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
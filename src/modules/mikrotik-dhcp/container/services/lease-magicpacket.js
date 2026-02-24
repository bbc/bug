"use strict";

const mongoCollection = require("@core/mongo-collection");
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (leaseId) => {
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

        const dbLeases = await mongoCollection("leases");
        const lease = await dbLeases.findOne({ "id": leaseId });

        if (!lease) {
            throw new Error(`lease with id ${leaseId} not found`);
        }

        if (!lease?.['mac-address']) {
            throw new Error(`lease with id ${leaseId} does not have a mac-address`);
        }
        await routerOsApi.run("/tool/wol", ["=mac=" + lease['mac-address']]);
        return true;

    } catch (err) {
        err.message = `lease-magicpacket: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
}
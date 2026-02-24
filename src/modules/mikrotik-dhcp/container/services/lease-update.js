"use strict";

const mongoCollection = require("@core/mongo-collection");
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (leaseId, formData) => {
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

        // get the previous values to compare
        const dbLeases = await mongoCollection("leases");
        const lease = await dbLeases.findOne({ "id": leaseId });

        if (!lease) {
            throw new Error(`lease with id ${leaseId} not found`);
        }

        // if lease isn't static, make it static first ...
        if (lease.dynamic) {
            logger.debug(`lease-update: making lease ${leaseId} static before update`);
            await routerOsApi.run("/ip/dhcp-server/lease/make-static", ["=numbers=" + leaseId]);
        }

        if (formData.address && formData.address !== lease.address) {
            logger.debug(`lease-update: updating address for lease ${leaseId} from '${lease.address}' to '${formData.address}'`);
            await routerOsApi.run("/ip/dhcp-server/lease/set", [`=numbers=${leaseId}`, `=address=${formData.address}`]);
        }

        if (formData.comment !== lease.comment) {
            logger.debug(`lease-update: updating comment for lease ${leaseId} from '${lease.comment}' to '${formData.comment}'`);
            await routerOsApi.run("/ip/dhcp-server/lease/set", [`=numbers=${leaseId}`, `=comment=${formData.comment ? formData.comment : ""}`]);
        }

        if (formData['mac-address'] && formData['mac-address'] !== lease['mac-address']) {
            logger.debug(`lease-update: updating mac-address for lease ${leaseId} from '${lease['mac-address']}' to '${formData['mac-address']}'`);
            await routerOsApi.run("/ip/dhcp-server/lease/set", [`=numbers=${leaseId}`, `=mac-address=${formData['mac-address']}`]);
        }

        if (formData.enabled === lease.disabled) {
            if (formData.enabled) {
                logger.debug(`lease-update: enabling lease ${leaseId}`);
                await routerOsApi.run("/ip/dhcp-server/lease/enable", ["=numbers=" + leaseId]);
            }
            else {
                logger.debug(`lease-update: disabling lease ${leaseId}`);
                await routerOsApi.run("/ip/dhcp-server/lease/disable", ["=numbers=" + leaseId]);
            }
        }

        if (formData['server'] && formData['server'] !== lease['server']) {
            logger.debug(`lease-update: updating server for lease ${leaseId} from '${lease['server']}' to '${formData['server']}'`);
            await routerOsApi.run("/ip/dhcp-server/lease/set", [`=numbers=${leaseId}`, `=server=${formData['server']}`]);
        }

        if (formData['address-lists'] !== undefined) {
            const formDataAddressListString = formData['address-lists'].join(",");
            if (formDataAddressListString !== lease['address-lists'].join(",")) {
                logger.debug(`lease-update: updating address-lists for lease ${leaseId} from '${lease['address-lists']}' to '${formDataAddressListString}'`);
                await routerOsApi.run("/ip/dhcp-server/lease/set", [`=numbers=${leaseId}`, `=address-lists=${formDataAddressListString}`]);
            }
        }

        return true;
    } catch (err) {
        err.message = `lease-update: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

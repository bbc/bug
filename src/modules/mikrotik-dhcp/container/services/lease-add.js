"use strict";

const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (params) => {
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

        const paramArray = [
            `=address=${params.address}`,
            `=mac-address=${params['mac-address']}`,
            `=disabled=${params.disabled ? "yes" : "no"}`,
        ];

        if (params.server && params.server !== "all") {
            paramArray.push(`=server=${params.server}`)
        }

        if (params['address-lists'] && params['address-lists'].length > 0) {
            paramArray.push(`=address-lists=${params['address-lists'].join(",")}`);
        }

        if (params.comment) {
            paramArray.push(`=comment=${params.comment}`)
        }

        logger.debug(`lease-info: adding lease with params ${JSON.stringify(params)}`);

        await routerOsApi.run("/ip/dhcp-server/lease/add", paramArray);
        logger.info(`lease-add: added lease for address ${params.address}`);
        return true;
    } catch (err) {
        err.message = `lease-add: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

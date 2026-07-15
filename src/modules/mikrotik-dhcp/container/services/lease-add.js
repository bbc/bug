"use strict";

const mongoCollection = require("@core/mongo-collection");
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

        logger.debug(`Adding lease with params ${JSON.stringify(params)}`);

        const result = await routerOsApi.run("/ip/dhcp-server/lease/add", paramArray);
        logger.info(`Added lease for address ${params.address}`);

        const newId = result?.[0]?.ret;
        if (newId) {
            const dbLeases = await mongoCollection("leases");
            const dbServers = await mongoCollection("servers");
            const server = params.server ? await dbServers.findOne({ id: params.server }) : null;
            await dbLeases.insertOne({
                id: newId,
                address: params.address,
                "mac-address": params["mac-address"],
                disabled: params.disabled ?? false,
                dynamic: false,
                server: server ? server.name : "all",
                "address-lists": params["address-lists"] || [],
                comment: params.comment || "",
                lastUpdated: new Date(),
            });
        }

        return true;
    } catch (err) {
        err.message = err.stack || err.message;
        logger.error(err.message);
        throw err;
    }
};

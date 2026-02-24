"use strict";

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

        // ensure address is provided
        if (!address || address === "undefined") {
            throw new Error("no address provided to clear connections");
        }

        // get the list of existing connections for the address from the router
        const srcAddressConnections = await routerOsApi.run(`/ip/firewall/connection/print`, [
            `.src-address=${address}`
        ]);
        const destAddressConnections = await routerOsApi.run(`/ip/firewall/connection/print`, [
            `.dst-address=${address}`
        ]);

        // combine the two lists and remove duplicates
        const allConnections = [...srcAddressConnections, ...destAddressConnections];
        const uniqueConnections = Array.from(new Set(allConnections.map(conn => conn.id)))
            .map(id => allConnections.find(conn => conn.id === id));

        // remove each connection from the router
        for (const connection of uniqueConnections) {
            await routerOsApi.run(`/ip/firewall/connection/remove`, [
                `=numbers=${connection[".id"]}`
            ]);
            logger.info(`entry-clearconnections: removed connection with id ${connection[".id"]} for address ${address}`);
        }

        logger.info(`entry-clearconnections: ${address} successfully cleared.`);
        return true;


    } catch (err) {
        err.message = `entry-clearconnections: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
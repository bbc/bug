"use strict";

const mikrotikConnect = require("@utils/mikrotik-connect");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (address) => {
    let conn;

    try {
        // ensure address is provided
        if (!address || address === "undefined") {
            throw new Error("no address provided to clear connections");
        }

        conn = await mikrotikConnect();
        if (!conn) throw new Error("could not connect to mikrotik router");

        console.log(address);
        // get the list of existing connections for the address from the router
        const srcAddressConnections = await conn.write(`/ip/firewall/connection/print`, [
            `.src-address=${address}`
        ]);
        const destAddressConnections = await conn.write(`/ip/firewall/connection/print`, [
            `.dst-address=${address}`
        ]);

        // combine the two lists and remove duplicates
        const allConnections = [...srcAddressConnections, ...destAddressConnections];
        const uniqueConnections = Array.from(new Set(allConnections.map(conn => conn.id)))
            .map(id => allConnections.find(conn => conn.id === id));

        console.log(uniqueConnections);


        // remove each connection from the router
        for (const connection of uniqueConnections) {
            await conn.write(`/ip/firewall/connection/remove`, [
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
    } finally {
        if (conn) conn.close();
    }
};
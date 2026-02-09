"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {

    try {
        // validate input
        if (!interfaceId) {
            throw new Error("invalid input: interfaceId is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`interface-disable: disabling interface ${interfaceId} via SNMP`);

        // create SNMP session
        const snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        await snmpAwait.set({
            oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
            value: 2,
        });

        logger.info(`interface-disable: SNMP success - updating DB`);

        // update the DB to match
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { "admin-state": false } }
        );

        if (dbResult.matchedCount !== 1) {
            throw new Error(
                `expected to update 1 interface in DB, matched ${dbResult.matchedCount}`
            );
        }

        await deviceSetPending(true);

        logger.info(`interface-disable: complete`);
    } catch (err) {
        err.message = `interface-disable(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

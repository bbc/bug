"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId) => {
    let snmpAwait;

    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`interface-disable: disabling interface ${interfaceId} ...`);

        // create SNMP session
        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        // disable the interface on the device
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

        // mark system as pending
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

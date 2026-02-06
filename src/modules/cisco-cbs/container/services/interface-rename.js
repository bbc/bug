"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId, newName) => {
    let snmpAwait;

    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        logger.info(`interface-rename: renaming interface ${interfaceId} to '${newName}' ...`);

        // perform SNMP set to rename interface
        await snmpAwait.set({
            oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
            value: newName.toString(),
        });

        logger.info(`interface-rename: success - updating DB`);

        // update the DB to match
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { alias: newName } }
        );

        logger.info(`interface-rename: ${JSON.stringify(dbResult.result)}`);

        if (dbResult.matchedCount !== 1) {
            throw new Error(
                `expected to update 1 interface in DB, matched ${dbResult.matchedCount}`
            );
        }

        // mark system as pending
        await deviceSetPending(true);

        logger.info(`interface-rename: complete`);
    } catch (err) {
        err.message = `interface-rename(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

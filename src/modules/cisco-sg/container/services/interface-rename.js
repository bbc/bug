"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, newName) => {
    let snmpAwait;

    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!newName && newName !== "") {
            throw new Error("newName is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        snmpAwait = new SnmpAwait({
            host: config.address,
            community: config.snmpCommunity,
        });

        logger.info(`renaming interface ${interfaceId} to '${newName}' ...`);

        await snmpAwait.set({
            oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
            value: newName.toString(),
        });

        logger.info("success - updating DB");

        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { alias: newName } }
        );

        if (dbResult.matchedCount !== 1) {
            throw new Error(`expected to update 1 interface in DB, matched ${dbResult.matchedCount}`);
        }

        logger.info(`${JSON.stringify(dbResult.result)}`);

        await deviceSetPending(true);

        logger.info("complete");
        return true;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

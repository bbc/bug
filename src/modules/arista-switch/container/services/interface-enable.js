"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`interface-enable: enabling interface ${interfaceId} ...`);

        // enable the interface on the device
        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", `interface ${interfaceId}`, "no shutdown"],
        });

        logger.info(`interface-enable: success - updating DB`);

        // update the DB to reflect enabled interface
        const interfacesCollection = await mongoCollection("interfaces");
        const dbInterface = await interfacesCollection.findOne({ interfaceId });

        if (!dbInterface) {
            throw new Error(`can't find interface ${interfaceId} in db to update`);
        }

        // determine link status based on linkProtocolStatus
        const linkStatus = dbInterface.linkProtocolStatus === "up" ? "connected" : "notconnect";

        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { linkStatus } }
        );

        logger.info(`interface-enable: ${JSON.stringify(dbResult.result)}`);
        await deviceSetPending(false);
        return true;

    } catch (err) {
        err.message = `interface-enable(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

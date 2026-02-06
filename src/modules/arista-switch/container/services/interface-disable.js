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

        logger.info(`interface-disable: disabling interface ${interfaceId} ...`);

        // disable the interface on the device
        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", `intserface ${interfaceId}`, "shutdown"],
        });

        logger.info(`interface-disable: success - updating DB`);

        // update the DB to reflect disabled interface
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { linkStatus: "disabled" } }
        );

        logger.info(`interface-disable: ${JSON.stringify(dbResult.result)}`);
        await deviceSetPending(false);
        return true;

    } catch (err) {
        err.message = `interface-disable(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

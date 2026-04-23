"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, newName) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`renaming interface ${interfaceId} to '${newName}' ...`);

        const descriptionCommand = newName ? `description ${newName}` : "no description";

        // update device
        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", `interface ${interfaceId}`, descriptionCommand],
        });

        logger.info(`success - updating DB`);

        // update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { description: newName } }
        );

        logger.info(`${JSON.stringify(dbResult.result)}`);
        await deviceSetPending(false);
        return true;

    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

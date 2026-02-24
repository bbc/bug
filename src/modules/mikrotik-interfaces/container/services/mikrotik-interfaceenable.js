"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const RouterOSApi = require("@core/routeros-api");
const configGet = require("@core/config-get");

module.exports = async (interfaceName) => {

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

        await routerOsApi.run("/interface/enable", ["=numbers=" + interfaceName]);
        logger.info(`mikrotik-interfaceenable: enabled interface ${interfaceName}`);

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ name: interfaceName }, { $set: { disabled: false } });
        logger.info(`interface-interfaceenable: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        logger.error(`mikrotik-interfaceenable: ${error.stack || error || error.message}`);
        return false;
    }
};

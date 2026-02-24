"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const configGet = require("@core/config-get");
const RouterOSApi = require("@core/routeros-api");

module.exports = async (interfaceId, interfaceName) => {

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

        await routerOsApi.run(`/interface/set`, [`=numbers=${interfaceId}`, "=name=" + interfaceName]);
        logger.info(`mikrotik-interfacerename: renamed interface ${interfaceName}`);

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ id: interfaceId }, { $set: { name: interfaceName } });
        logger.info(`interface-interfacerename: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (error) {
        logger.error(`mikrotik-interfacerename: ${error.stack || error || error.message}`);
        return false;
    }
};

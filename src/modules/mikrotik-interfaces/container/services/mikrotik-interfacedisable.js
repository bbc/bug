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

        await routerOsApi.run("/interface/disable", ["=numbers=" + interfaceName]);
        logger.info(`disabled interface ${interfaceName}`);

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne({ name: interfaceName }, { $set: { disabled: true } });
        logger.info(`database update result: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

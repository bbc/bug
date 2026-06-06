"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const configGet = require("@core/config-get");
const RouterOSApi = require("@core/routeros-api");

module.exports = async (interfaceId, interfaceComment) => {
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

        await routerOsApi.run(`/interface/set`, [`=numbers=${interfaceId}`, "=comment=" + interfaceComment]);
        logger.info(`Set comment on interface ${interfaceId} to '${interfaceComment}'`);

        // now update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { id: interfaceId },
            { $set: { comment: interfaceComment } }
        );
        logger.info(`Database update result: ${JSON.stringify(dbResult.result)}`);

        return true;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

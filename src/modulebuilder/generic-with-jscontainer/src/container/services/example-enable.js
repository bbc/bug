"use strict";

const configGet = require("@core/config-get");
const yourApi = require("@utils/your-api");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (id) => {
    try {
        const config = await configGet();

        logger.info(`enabling item ${id} ...`);

        // enable the item on the device
        await yourApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable"],
        });

        logger.info("success - updating DB");

        // update the DB to reflect enabled interface
        const itemCollection = await mongoCollection("items");
        const dbResult = await itemCollection.updateOne(
            { id },
            { $set: { enabled: true } }
        );

        logger.info(`${JSON.stringify(dbResult.result)}`);
        await deviceSetPending(true);
        return true;

    } catch (err) {
        err.message = `example-enable(${id}): ${err.stack || err.message || err}`;
        throw err;
    }
};

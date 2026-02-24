"use strict";
const logger = require("@core/logger")(module);

module.exports = async (collection, interfaceArray) => {
    try {
        let saveDocument = {
            timestamp: new Date(),
            interfaces: {},
        };

        for (let eachInterface of interfaceArray) {
            const interfaceName = eachInterface["name"].replace(/\./g, "_");
            saveDocument.interfaces[interfaceName] = {
                tx: eachInterface["tx-bits-per-second"],
                rx: eachInterface["rx-bits-per-second"],
            };
        }
        await collection.insertOne(saveDocument);
    } catch (err) {
        err.message = `traffic-savehistory: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

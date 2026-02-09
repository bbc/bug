"use strict";
const logger = require("@core/logger")(module);

module.exports = async (collection, interfaceArray) => {
    try {
        let saveDocument = {
            timestamp: new Date(),
            interfaces: {},
        };
        for (let eachInterface of interfaceArray) {
            try {
                saveDocument.interfaces[eachInterface["id"]] = {
                    tx: eachInterface["tx-rate"],
                    rx: eachInterface["rx-rate"],
                };
            } catch (error) {
                logger.info(error);
            }
        }
        collection.insertOne(saveDocument);
    } catch (err) {
        err.message = `traffic-savehistory: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};

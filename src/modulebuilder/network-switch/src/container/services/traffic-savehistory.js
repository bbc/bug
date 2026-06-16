"use strict";

const logger = require("@core/logger")(module);

module.exports = async (collection, interfaceArray) => {
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
            logger.error(error);
        }
    }
    collection.insertOne(saveDocument);
};

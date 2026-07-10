
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {

    try {

        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find().toArray();
        const deviceCount = devices?.length || 0;
        let message = `Controller connected with ${deviceCount} active device(s)`;

        return new StatusItem({
            message: message,
            key: "defaultservice",
            type: "default",
            flags: [],
        })

    } catch (err) {
        logger.error(err.stack || err.message);
    }
    return [];
};

'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    try {

        const connectionsCollection = await mongoCollection("connections");

        const connectedOg = await connectionsCollection.find({ "state": "Connected", "answering": 0 })?.toArray();
        const connectedOgCount = connectedOg ? connectedOg.length : 0;

        const connectedIc = await connectionsCollection.find({ "state": "Connected", "answering": 1 })?.toArray();
        const connectedIcCount = connectedIc ? connectedIc.length : 0;

        if (connectedOgCount > 0 || connectedIcCount > 0) {
            return new StatusItem({
                message: `Active connection(s): ${connectedOgCount} outgoing, ${connectedIcCount} incoming`,
                key: "connections",
                type: "success",
                flags: [],
            })
        }
        return []

    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};
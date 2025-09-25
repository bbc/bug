"use strict";
const turtleWebApi = require("@utils/turtle-webapi");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (destinationDevice, destinationIndex, sourceDevice, sourceIndex) => {

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`device-route: failed to fetch config`);
        return false;
    }

    const command = ["SET", "DANTE", "DEV", destinationDevice, "AUDIO", "RXCHN", destinationIndex, "SOURCE", sourceDevice, "CHN", sourceIndex];

    // we get no usable response from the box, so we just assume it's worked
    await turtleWebApi.command(config.address, command);

    const routesCollection = await mongoCollection("routes");
    const sourcesCollection = await mongoCollection("sources");
    const destinationsCollection = await mongoCollection("destinations");

    const destinationDocument = await destinationsCollection.findOne({ deviceId: destinationDevice });
    const sourceDocument = await sourcesCollection.findOne({ deviceId: sourceDevice });
    const routeDocument = await routesCollection.findOne({ deviceId: destinationDevice });
    if (!sourceDocument || !routeDocument || !destinationDocument) {
        return false;
    }

    const route = {
        destinationChannel: destinationDocument.labels[destinationIndex - 1]?.name,
        destinationIndex: destinationIndex,
        sourceDevice: sourceDevice,
        sourceChannel: sourceDocument?.labels[sourceIndex - 1]?.name,
        sourceIndex: sourceIndex
    }

    const result = await routesCollection.updateOne({ deviceId: destinationDevice, "routes.destinationIndex": destinationIndex },
        { $set: { "routes.$": route } })

    return true;
};



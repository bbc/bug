"use strict";
const turtleWebApi = require("@utils/turtle-webapi");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (destinationDevice, destinationIndex, sourceDevice, sourceIndex) => {

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error("missing config");
        }
    } catch (error) {
        logger.error(`failed to fetch config: ${error.message}`);
        throw new Error("failed to fetch config");
    }

    logger.info(`applying route: ${sourceDevice} channel ${sourceIndex} -> ${destinationDevice} channel ${destinationIndex}`);
    const command = ["SET", "DANTE", "DEV", destinationDevice, "AUDIO", "RXCHN", destinationIndex, "SOURCE", sourceDevice, "CHN", sourceIndex];

    // we get no usable response from the box, so we just assume it's worked
    try {
        await turtleWebApi.command(config.address, command);
    } catch (error) {
        logger.error(`failed to apply route command: ${error.message}`);
        throw new Error("failed to apply route command");
    }

    const routesCollection = await mongoCollection("routes");
    const sourcesCollection = await mongoCollection("sources");
    const destinationsCollection = await mongoCollection("destinations");

    const destinationDocument = await destinationsCollection.findOne({ deviceId: destinationDevice });
    const sourceDocument = await sourcesCollection.findOne({ deviceId: sourceDevice });
    const routeDocument = await routesCollection.findOne({ deviceId: destinationDevice });
    if (!sourceDocument || !routeDocument || !destinationDocument) {
        logger.error(`missing source, destination, or route document for route update`);
        throw new Error("missing source, destination, or route document for route update");
    }

    const route = {
        destinationChannel: destinationDocument.labels[destinationIndex - 1]?.name,
        destinationIndex: destinationIndex,
        sourceDevice: sourceDevice,
        sourceChannel: sourceDocument?.labels[sourceIndex - 1]?.name,
        sourceIndex: sourceIndex,
        status: "IN_PROGRESS",
    }

    const lastUpdated = new Date();

    const result = await routesCollection.updateOne({ deviceId: destinationDevice, "routes.destinationIndex": destinationIndex },
        {
            $set: {
                "routes.$": route,
                timestamp: lastUpdated,
                lastUpdated,
                skipNextWorkerUpdate: true,
            },
        })

    if (result.matchedCount > 0) {
        logger.info(`route update successful for destination ${destinationDevice} channel ${destinationIndex}`);
    } else {
        logger.error(`route update target not found for destination ${destinationDevice} channel ${destinationIndex}`);
        throw new Error("route update target not found");
    }

    return true;
};



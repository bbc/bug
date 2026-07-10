"use strict";
const turtleWebApi = require("@utils/turtle-webapi");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (buttonType, device, index, newName) => {

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

    logger.info(`renaming ${buttonType} device ${device} channel ${index} -> new name ${newName}`);
    const command = ["SET", "DANTE", "DEV", device, "AUDIO", buttonType === "destination" ? "RXCHN" : "TXCHN", index, "NAME", newName];

    try {
        await turtleWebApi.command(config.address, command);
    } catch (error) {
        logger.error(`failed to rename ${buttonType}: ${error.message}`);
        throw new Error(`failed to rename ${buttonType}`);
    }

    const buttonCollection = await mongoCollection(`${buttonType}s`);

    const buttonDocument = await buttonCollection.findOne({ deviceId: device });
    if (!buttonDocument) {
        logger.error(`missing ${buttonType} document for ${buttonType} rename`);
        throw new Error(`missing ${buttonType} document for ${buttonType} rename`);
    }

    const lastUpdated = new Date();

    const result = await buttonCollection.updateOne({ deviceId: device, "labels.index": index },
        {
            $set: {
                "labels.$.name": newName,
                timestamp: lastUpdated,
                lastUpdated,
            },
        });

    if (result.matchedCount > 0) {
        logger.info(`${buttonType} rename successful for device ${device} channel ${index}`);
    } else {
        logger.error(`${buttonType} rename target not found for device ${device} channel ${index}`);
        throw new Error(`${buttonType} rename target not found`);
    }

    return true;
};



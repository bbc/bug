
"use strict";
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const turtleWebApi = require("@utils/turtle-webapi");
const configGet = require("@core/config-get");

module.exports = async (buttonType, device, index) => {

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

    // find out how many buttons there are
    const buttonCollection = await mongoCollection(`${buttonType}s`);

    const buttonDocument = await buttonCollection.findOne({ deviceId: device });
    if (!buttonDocument) {
        logger.error(`missing ${buttonType} document for ${buttonType} clear label`);
        throw new Error(`missing ${buttonType} document for ${buttonType} clear label`);
    }
    const labelCount = buttonDocument.labels.length;

    // reset the name to the button index. If total buttons is more than 9, pad with leading zero
    // if total buttons is more than 99, pad with two leading zeros
    let newName = `${index}`;
    if (labelCount > 9) {
        newName = newName.padStart(2, "0");
    }
    if (labelCount > 99) {
        newName = newName.padStart(3, "0");
    }

    logger.info(`clearing label on ${buttonType} device ${device} channel ${index}`);
    const command = ["SET", "DANTE", "DEV", device, "AUDIO", buttonType === "destination" ? "RXCHN" : "TXCHN", index, "NAME", newName];
    try {
        await turtleWebApi.command(config.address, command);
    } catch (error) {
        logger.error(`failed to clear label for ${buttonType}: ${error.message}`);
        throw new Error(`failed to clear label for ${buttonType}`);
    };

    const lastUpdated = new Date();

    const result = await buttonCollection.updateOne({ deviceId: device, "labels.index": index },
        {
            $set: {
                "labels.$.name": newName,
                timestamp: lastUpdated,
                lastUpdated,
                skipNextWorkerUpdate: true,
            },
        });

    if (result.matchedCount > 0) {
        logger.info(`${buttonType} clear label successful for device ${device} channel ${index}`);
    } else {
        logger.error(`${buttonType} clear label target not found for device ${device} channel ${index}`);
        throw new Error(`${buttonType} clear label target not found`);
    }

    return true;
}

// SET%20DANTE%20DEV%20MC-N3920821%20NAME%20MC-N39208212

"use strict";
const turtleWebApi = require("@utils/turtle-webapi");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (deviceName, newName) => {

    if (typeof newName !== "string" || newName === "" || newName === undefined || newName === null) {
        throw new Error("new name is required");
    }
    if (newName.length > 30) {
        throw new Error("new name must be 30 characters or less");
    }
    // check it only has letters numbers and dashes
    if (!/^[a-zA-Z0-9-]+$/.test(newName)) {
        throw new Error("new name must only contain letters, numbers, and dashes");
    }
    // check it doesn't begin or end with a dash
    if (newName.startsWith("-") || newName.endsWith("-")) {
        throw new Error("new name must not begin or end with a dash");
    }

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

    logger.info(`renaming device ${deviceName} -> new name ${newName}`);
    const command = ["SET", "DANTE", "DEV", deviceName, "NAME", newName];

    try {
        await turtleWebApi.command(config.address, command);
    } catch (error) {
        logger.error(`failed to rename device: ${error.message}`);
        throw new Error(`failed to rename device`);
    }

    const lastUpdated = new Date();

    const devicesCollection = await mongoCollection(`devices`);
    const devicesResult = await devicesCollection.updateOne({ name: deviceName },
        {
            $set: {
                name: newName,
                timestamp: lastUpdated,
                lastUpdated,
            },
        });
    if (devicesResult.matchedCount > 0) {
        logger.info(`devices rename successful for device ${deviceName}`);
    } else {
        logger.error(`devices rename target not found for device ${deviceName}`);
    }

    for (let eachCollection of ["sources", "destinations"]) {
        const collection = await mongoCollection(eachCollection);
        const result = await collection.updateOne({ deviceId: deviceName },
            {
                $set: {
                    deviceId: newName,
                    timestamp: lastUpdated,
                    lastUpdated,
                },
            });
        if (result.matchedCount > 0) {
            logger.info(`${eachCollection} rename successful for device ${deviceName}`);
        } else {
            logger.error(`${eachCollection} rename target not found for device ${deviceName}`);
        }
    }

    return true;
};



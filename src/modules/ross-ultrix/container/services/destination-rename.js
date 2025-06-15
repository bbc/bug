"use strict";
const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async (destinationIndex, name = "") => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // fetch the existing data first
    const destinationsRaw = await mongoSingle.get("destinationsRaw");
    const match = destinationsRaw.find((r) => r.uiId === destinationIndex);
    if (!match) {
        logger.error(`destination-rename: failed to find destination index ${destinationIndex}`);
        throw new Error()
    }

    if (destinationsRaw.find((r) => r.uiId !== destinationIndex && r.name === name)) {
        logger.error(`destination-rename: destination name ${name} already exists`);
        throw new Error()
    }

    match.name = name;

    // the tallymode update is different from the get. We have to update it.
    const tallyModes = {
        "Normal": 0,
        "Redirect": 1,
        "Routed": 2
    }
    match.tallyMode = tallyModes[match.tallyMode]

    logger.info(`destination-rename: updating name with data ${JSON.stringify([match])}`);

    // write it back
    if (!await ultrixWebApi.post("destination/update", config, JSON.stringify([match]))) {
        logger.error(`destination-rename: failed to update destination label`);
        throw new Error()
    }

    // update the db
    const destinations = await mongoSingle.get("destinations");
    logger.info(`destination-rename: updating db for destination ${destinationIndex} with name ${name}`);
    const destination = destinations.find((s) => s.uiId === destinationIndex);
    if (destination) {
        destination.name = name;
        await mongoSingle.set("destinations", destinations);
        logger.info(`destination-rename: updated destination ${destinationIndex} in db ok`);
    }
    return true;
};

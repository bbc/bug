"use strict";

const globalMatrix = require("@utils/matrix");
const logger = require("@core/logger")(module);
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-route: failed to fetch config`);
        return false;
    }

    const routesCollection = await mongoCollection("routes");

    const destinationInt = parseInt(destinatonIndex);
    const sourceInt = parseInt(sourceIndex);

    const matrix = await globalMatrix();

    // oh my life. Ryan's SW08 module assumed everything is 1-based. AGGGGHHHHH

    // also ... it sometimes doesn't work, so we're going to do it twice. :(
    const status1 = await matrix.routeAllLevels(sourceInt + 1, destinationInt + 1);
    const status2 = await matrix.routeAllLevels(sourceInt + 1, destinationInt + 1);

    if (status1 === 1 || status2 === 1) {
        logger.info(`Routed Source #${sourceInt} to Destination #${destinationInt} on all levels`);

        // now update db
        const query = { destination: parseInt(destinatonIndex) };
        const payload = { "$set": { "levels": new Array(16).fill(parseInt(sourceIndex)) } };
        const options = { upsert: true };
        await routesCollection.updateOne(query, payload, options);

        return true;
    }
    else {
        console.error(`Failed to route Source #${sourceInt} to Destination #${destinationInt} on all levels`);
        return false
    }
};

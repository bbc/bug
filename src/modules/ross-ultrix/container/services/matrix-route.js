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
    const status = await matrix.routeAllLevels(sourceInt + 1, destinationInt + 1);
    if (status === 1) {
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

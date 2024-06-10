"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-route: failed to fetch config`);
        return false;
    }

    const sourceQuads = config.sourceQuads ? config.sourceQuads : [];
    const destinationQuads = config.destinationQuads ? config.destinationQuads : [];

    const routeCommands = [];
    if (destinationQuads?.[destinatonIndex] === true) {
        // quad destination. Check sources
        if (sourceQuads?.[sourceIndex] === true) {
            // bullseye - route all four!
            for (let a = 0; a < 4; a++) {
                routeCommands.push(`${parseInt(destinatonIndex) + a} ${parseInt(sourceIndex) + a}`);
            }
        } else {
            // well ... it's not ideal but we should probably route the same source to all four destinations
            for (let a = 0; a < 4; a++) {
                routeCommands.push(`${parseInt(destinatonIndex) + a} ${sourceIndex}`);
            }
        }
    } else {
        // just a normal route - oh well.
        routeCommands.push(`${destinatonIndex} ${sourceIndex}`);
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("VIDEO OUTPUT ROUTING", routeCommands);
        return true;
    } catch (error) {
        logger.error("videohub-route: ", error);
        return false;
    }
};

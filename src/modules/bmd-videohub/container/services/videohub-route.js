"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (destinationIndex, sourceIndex) => {
    let router = null;
    try {
        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // validate inputs
        if (destinationIndex === undefined || destinationIndex === null || isNaN(destinationIndex)) {
            throw new Error("invalid destinationIndex provided");
        }
        if (sourceIndex === undefined || sourceIndex === null || isNaN(sourceIndex)) {
            throw new Error("invalid sourceIndex provided");
        }

        // fallback to empty arrays if not defined
        const sourceQuads = config.sourceQuads ?? [];
        const destinationQuads = config.destinationQuads ?? [];

        // prepare routing commands
        const routeCommands = [];

        if (destinationQuads[destinationIndex] === true) {
            // quad destination - check sources
            if (sourceQuads[sourceIndex] === true) {
                // bullseye - route all four!
                for (let a = 0; a < 4; a++) {
                    routeCommands.push(`${parseInt(destinationIndex) + a} ${parseInt(sourceIndex) + a}`);
                }
            } else {
                // route same source to all four destinations
                for (let a = 0; a < 4; a++) {
                    routeCommands.push(`${parseInt(destinationIndex) + a} ${sourceIndex}`);
                }
            }
        } else {
            // normal route
            routeCommands.push(`${destinationIndex} ${sourceIndex}`);
        }

        // connect to videohub router
        router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send routing command and wait for response
        await router.send("VIDEO OUTPUT ROUTING", routeCommands);

        // Wait briefly for device to process the command
        const response = await router.query("VIDEO OUTPUT ROUTING");
        if (!response) {
            throw new Error("Failed to verify routing command");
        }

        logger.info(`routed destination ${destinationIndex} to source ${sourceIndex}`);
        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    } finally {
        if (router) {
            await router.disconnect();
        }
    }
};

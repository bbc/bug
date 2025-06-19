"use strict";
const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async (sourceIndex, name = "") => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // fetch the existing data first
    const sourcesRaw = await mongoSingle.get("sourcesRaw");
    const match = sourcesRaw.find((r) => r.uiId === sourceIndex);
    if (!match) {
        logger.error(`source-rename: failed to find source index ${sourceIndex}`);
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

    logger.info(`source-rename: updating name with data ${JSON.stringify([match])}`);

    // write it back
    if (!await ultrixWebApi.post("source/update", config, JSON.stringify([match]))) {
        logger.error(`source-rename: failed to update source label`);
        throw new Error()
    }

    // update the db
    const sources = await mongoSingle.get("sources");
    logger.info(`source-rename: updating db for source ${sourceIndex} with name ${name}`);
    const source = sources.find((s) => s.uiId === sourceIndex);
    if (source) {
        source.name = name;
        await mongoSingle.set("sources", sources);
        logger.info(`source-rename: updated source ${sourceIndex} in db ok`);
    }
    return true;
};

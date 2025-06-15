"use strict";
const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async (sourceIndex, description = "") => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // fetch the existing data first
    const sourcesRaw = await mongoSingle.get("sourcesRaw");
    const match = sourcesRaw.find((r) => r.uiId === sourceIndex);
    if (!match) {
        logger.error(`source-setdescription: failed to find source index ${sourceIndex}`);
        throw new Error()
    }

    match.description = description;

    // the tallymode update is different from the get. We have to update it.
    const tallyModes = {
        "Normal": 0,
        "Redirect": 1,
        "Routed": 2
    }
    match.tallyMode = tallyModes[match.tallyMode]

    logger.info(`source-setdescription: updating description with data ${JSON.stringify([match])}`);

    // write it back
    if (!await ultrixWebApi.post("source/update", config, JSON.stringify([match]))) {
        logger.error(`source-setdescription: failed to update source description`);
        throw new Error()
    }

    // update the db
    const sources = await mongoSingle.get("sources");
    logger.info(`source-setdescription: updating db for source ${sourceIndex} with description ${description}`);
    const source = sources.find((s) => s.uiId === sourceIndex);
    if (source) {
        source.description = description;
        await mongoSingle.set("sources", sources);
        logger.info(`source-setdescription: updated source ${sourceIndex} in db ok`);
    }
    return true;
};

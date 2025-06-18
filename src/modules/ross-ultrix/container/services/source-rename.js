"use strict";
const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const fetchSources = require("@utils/fetch-sources");

module.exports = async (sourceIndex, name = "") => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // we need to fetch destinations from the device first - in case it hasn't updated recently
    await fetchSources(config);

    // fetch the existing data first
    const sourcesRaw = await mongoSingle.get("sourcesRaw");
    const match = sourcesRaw.find((r) => r.uiId === sourceIndex);
    if (!match) {
        logger.error(`source-rename: failed to find source index ${sourceIndex}`);
        throw new Error()
    }

    if (sourcesRaw.find((r) => r.uiId !== sourceIndex && r.name === name)) {
        logger.error(`source-rename: source name ${name} already exists`);
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

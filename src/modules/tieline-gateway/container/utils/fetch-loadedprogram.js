"use strict";

const parseProgramProperties = require("@utils/parse-programproperties");
const logger = require("@core/logger")(module);

// this service fetches the current program from the device, and stores it in the db
// it's called from the loadedprogram worker, and in response to a notification
module.exports = async ({ tielineApi, mongoSingle }) => {

    // fetch the loaded program
    const loadedProgramResult = await tielineApi.get("/api/get_loaded_program");
    const result = loadedProgramResult?.result;

    const loadedProgram = {
        handle: result?.["prog-handle"]?._text,
        name: result?.NAME?._text,
        direction: result?.direction?._text,
    };

    if (!loadedProgram.handle) {
        logger.debug(`fetch-loadedprogram: no loaded program`);
        await mongoSingle.set("loadedProgram", null, 120);
        return;
    }

    logger.debug(
        `fetch-loadedprogram: currently loaded program is '${loadedProgram.name} (${loadedProgram.handle})' - fetching properties`
    );

    // fetch program properties
    const programPropertiesResult = await tielineApi.get(
        `/api/get_program_properties?prog-handle=${encodeURIComponent(loadedProgram.handle)}`
    );

    // parse properties
    const parsedProgramProperties = await parseProgramProperties(programPropertiesResult);

    // merge results
    const mergedProgram = {
        ...loadedProgram,
        ...parsedProgramProperties,
    };

    // save to DB
    await mongoSingle.set("loadedProgram", mergedProgram, 120);
};
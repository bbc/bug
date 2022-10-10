"use strict";

const parseProgramProperties = require("@services/parse-programproperties");
const mongoSingle = require("@core/mongo-single");

// this service fetches the current program from the device, and stores it in the db
// it's called from the loadedprogram worker, and in response to a notification
module.exports = async (TielineApi) => {
    // fetch the loaded program
    const loadedProgramResult = await TielineApi.get("/api/get_loaded_program");

    const loadedProgram = {
        handle: loadedProgramResult?.["result"]?.["prog-handle"]?.["_text"],
        name: loadedProgramResult?.["result"]?.["NAME"]?.["_text"],
        direction: loadedProgramResult?.["result"]?.["direction"]?.["_text"],
    };

    console.log(
        `fetch-loadedprogram: currently loaded program is ${loadedProgram["name"]} (${loadedProgram["handle"]}) - fetching properties`
    );

    // now get the rest of the properties of the loaded programme
    const programPropertiesResult = await TielineApi.get(
        `/api/get_program_properties?prog-handle=${loadedProgram["handle"]}`
    );

    // we use a shared service to parse and process it
    const parsedProgramProperties = await parseProgramProperties(programPropertiesResult);

    // then merge the results with the loaded program info
    const mergedProgram = { ...loadedProgram, ...parsedProgramProperties };

    // save to DB
    await mongoSingle.set("loadedProgram", mergedProgram, 120);
};

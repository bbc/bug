"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async (programHandle) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    try {
        const TielineApi = new tielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        console.log(`program-load: loading program handle ${programHandle}`);
        const postResult = await TielineApi.post("/api/load_program", { "prog-handle": programHandle });
        if (postResult?.result?.["prog-handle"]?.["_text"] === programHandle) {
            // update the db (to match)
            const programList = await mongoSingle.get("programList");
            const loadedProgram = programList && programList.find((program) => program.handle === programHandle);
            if (loadedProgram) {
                // copy it into the loadedprogram collection
                await mongoSingle.set("loadedProgram", mongoSingle);
            }
            return true;
        }
    } catch (error) {
        console.log(`program-load: ${error}`);
    }
    return false;
};

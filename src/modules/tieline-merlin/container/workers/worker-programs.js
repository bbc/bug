"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const tielineApi = require("@utils/tieline-api");
const ensureArray = require("@utils/ensure-array");
const parseProgramProperties = require("@services/parse-programproperties");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Kick things off
    console.log(`worker-programs: doing something ...`);

    // use an infinite loop
    while (true) {
        try {
            console.log(`worker-programs: fetching get_program_handles ...`);
            // fetch the loaded programme
            const programListFromApi = await TielineApi.get("/api/get_program_handles");
            console.log(`worker-programs: ... got get_program_handles`);

            if (programListFromApi && programListFromApi.result && programListFromApi.result["prog-prop"]) {
                // pull out the handle and name from the result
                const programList = programListFromApi.result["prog-prop"].map((program, index) => {
                    return {
                        index: index,
                        handle: program?.["_attributes"]?.["prog-handle"],
                        name: program?.["_text"],
                    };
                });

                // now loop through each one and get program properties
                const programListWithProperties = [];
                for (let eachProgram of programList) {
                    // now get the rest of the properties of this programme
                    const programPropertiesResult = await TielineApi.get(
                        `/api/get_program_properties?prog-handle=${eachProgram["handle"]}`
                    );

                    // we use a shared service to parse and process it
                    const parsedProgramProperties = await parseProgramProperties(programPropertiesResult);

                    // then merge the results with the programme
                    programListWithProperties.push({ ...eachProgram, ...parsedProgramProperties });
                }

                // save to DB
                await mongoSingle.set("programList", programListWithProperties, 60);
            }

            // delay before doing it all again ...
            await delay(15000);
        } catch (error) {
            console.log(`worker-programs: ${error}`);
            console.log("worker-programs: waiting a second, then trying again");
            await delay(1500);
        }
    }
};

main();

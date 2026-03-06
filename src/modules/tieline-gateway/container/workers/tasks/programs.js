"use strict";

const logger = require("@core/logger")(module);
const ensureArray = require("@utils/ensure-array");
const parseProgramProperties = require("@utils/parse-programproperties");
const pLimit = require("p-limit");

module.exports = async ({ tielineApi, mongoSingle }) => {
    try {
        logger.debug(`fetching program handles`);

        const programListFromApi = await tielineApi.get("/api/get_program_handles");
        const progs = ensureArray(programListFromApi?.result?.["prog-prop"]);

        if (!progs.length) {
            await mongoSingle.set("programList", [], 60);
            return;
        }

        const programs = progs.map((program, index) => ({
            index,
            handle: program?._attributes?.["prog-handle"],
            name: program?._text,
        }));

        // limit concurrency to 3 simultaneous requests
        const limit = pLimit(3);

        const programListWithProperties = await Promise.all(
            programs.map(program =>
                limit(async () => {
                    const programPropertiesResult = await tielineApi.get(
                        `/api/get_program_properties?prog-handle=${encodeURIComponent(program.handle)}`
                    );

                    const parsedProgramProperties = await parseProgramProperties(programPropertiesResult);

                    return {
                        ...program,
                        ...parsedProgramProperties,
                    };
                })
            )
        );

        logger.debug(`found ${programListWithProperties.length} program(s) - saving to db`);

        await mongoSingle.set("programList", programListWithProperties, 60);

    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
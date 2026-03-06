"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const programList = await mongoSingle.get("programList");
        if (!programList) {
            return [];
        }

        const loadedProgram = await mongoSingle.get("loadedProgram");

        return programList.map((program) => {
            const groups = Array.isArray(program.groups) ? program.groups : [];
            return {
                index: program.index,
                handle: program.handle,
                name: program.name,
                description: program.description,
                _groupCount: groups.length,
                _loaded: program.handle === loadedProgram?.handle,
            };
        });

    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
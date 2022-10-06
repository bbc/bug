"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const programList = await mongoSingle.get("programList");
    if (!programList) {
        return [];
    }

    const loadedProgram = await mongoSingle.get("loadedProgram");
    const mappedProgramList =
        programList &&
        programList.map((program) => {
            return {
                index: program.index,
                handle: program.handle,
                name: program.name,
                description: program.description,
                _groupCount: program.groups.length,
                _loaded: program.handle === loadedProgram?.handle,
            };
        });
    return mappedProgramList;
};

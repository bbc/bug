"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (programHandle) => {
    try {
        if (!programHandle || typeof programHandle !== "string") {
            throw new Error("invalid programHandle");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const tielineApi = new TielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        logger.info(`loading program handle ${programHandle}`);

        const postResult = await tielineApi.post("/api/load_program", { "prog-handle": programHandle });

        if (postResult?.result?.["prog-handle"]?.["_text"] === programHandle) {
            // update the db (to match)
            const programList = await mongoSingle.get("programList");
            const loadedProgram = programList?.find((program) => program.handle === programHandle);

            if (loadedProgram) {
                // copy it into the loadedProgram collection
                await mongoSingle.set("loadedProgram", loadedProgram);
            }

            return true;
        }

        return false;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
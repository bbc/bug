"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (programHandle, groupId, connectionId, updateParams) => {
    try {
        if (!programHandle || !groupId || !connectionId || typeof updateParams !== "object") {
            throw new Error("invalid input parameters");
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

        logger.info(`${programHandle} / ${groupId} / ${connectionId} / ${JSON.stringify(updateParams)}`);

        const postData = {
            destination: {
                _attributes: {
                    "prog-handle": programHandle,
                    "group-id": groupId,
                    "cxn-id": connectionId,
                },
                endpoints: {},
            },
        };

        if (updateParams.destination !== undefined) postData.destination.endpoints.DESTINATION = updateParams.destination;
        if (updateParams.sessionPort !== undefined) postData.destination.endpoints.SESSION_PORT = updateParams.sessionPort;
        if (updateParams.audioPort !== undefined) postData.destination.endpoints.AUDIO_PORT = updateParams.audioPort;
        if (updateParams.via !== undefined) postData.destination.endpoints.via = updateParams.via;
        if (updateParams.name !== undefined) postData.destination.endpoints.name = updateParams.name;

        logger.info(`updating destination: ${JSON.stringify(postData)}`);

        const postResult = await tielineApi.post("/api/set_destination", postData);

        const success = postResult?.result?.["prog-handle"]?.["_text"] === programHandle;

        logger.info(`update ${success ? "succeeded" : "failed"}`);

        return success;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
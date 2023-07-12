"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");

module.exports = async (programHandle, groupId, connectionId, updateParams) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    const TielineApi = new tielineApi({
        host: config.address,
        username: config.username,
        password: config.password,
    });

    console.log(
        `destination-update: ${programHandle} / ${groupId} / ${connectionId} / ${JSON.stringify(updateParams)}`
    );

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

    if (updateParams.destination !== undefined) {
        postData.destination.endpoints.DESTINATION = updateParams.destination;
    }
    if (updateParams.sessionPort !== undefined) {
        postData.destination.endpoints.SESSION_PORT = updateParams.sessionPort;
    }
    if (updateParams.audioPort !== undefined) {
        postData.destination.endpoints.AUDIO_PORT = updateParams.audioPort;
    }
    if (updateParams.via !== undefined) {
        postData.destination.endpoints.via = updateParams.via;
    }
    if (updateParams.name !== undefined) {
        postData.destination.endpoints.name = updateParams.name;
    }
    console.log(`destination-update: updating destination: ${JSON.stringify(postData)}`);
    const postResult = await TielineApi.post("/api/set_destination", postData);
    return postResult?.result?.["prog-handle"]?.["_text"] === programHandle;
};

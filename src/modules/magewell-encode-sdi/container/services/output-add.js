"use strict";

const codecdataGet = require("@services/codecdata-get");
const localdataSet = require("@services/localdata-set");

function buildDefaultOutput(nextId) {
    return {
        id: nextId,
        type: 133,
        name: `output-${nextId + 1}`,
        "is-use": 1,
        url: "192.168.100.1",
        port: 5001 + nextId,
        "net-mode": 1,
        "stream-index": 0,
        audio: 0,
        "is-custom-pid": 0,
    };
}

module.exports = async () => {
    const codecData = await codecdataGet();
    const streamServers = Array.isArray(codecData?.["stream-server"]) ? codecData["stream-server"] : [];
    const nextId = streamServers.reduce((maxId, streamServer) => {
        return Number.isInteger(streamServer?.id) && streamServer.id > maxId ? streamServer.id : maxId;
    }, -1) + 1;

    return await localdataSet({
        "stream-server": [...streamServers, buildDefaultOutput(nextId)],
    });
};
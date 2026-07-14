"use strict";

const codecdataGet = require("@services/codecdata-get");
const localdataSet = require("@services/localdata-set");

function buildDefaultOutput(nextId) {
    return {
        // common fields
        id: nextId,
        type: 120,
        name: `output-${nextId + 1}`,
        "is-use": 0,
        url: "192.168.100.1",
        port: 5001 + nextId,
        "net-mode": 1,
        "stream-index": 0,
        ttl: 64,
        audio: 0,
        "audio-streams": 1,
        "is-custom-pid": 0,
        opt: 0,
        "is-media-hub": 0,
        // SRT (type 120 / 121) fields
        latency: 120,
        bandwidth: 25,
        "conn-timeout": 3000,
        "retry-duration": 10000,
        "max-connections": 1,
        aes: 0,
        "aes-word": "",
        "stream-id": "",
        mtu: 1496,
        token: "",
        "event-data": "",
        // UDP / RTP (type 132 / 133) fields
        "pmt-pid": 0,
        "pcr-pid": 0,
        "video-pid": 0,
        "audio-pid": 0,
        "audio-pids": [],
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
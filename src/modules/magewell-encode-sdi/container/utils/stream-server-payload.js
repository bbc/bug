"use strict";

const { pickDefined, hasPayloadChanged } = require("@utils/payload-utils");

const commonStreamServerPayloadKeys = [
    "id",
    "type",
    "name",
    "is-use",
    "url",
    "port",
    "net-mode",
    "stream-index",
    "ttl",
    "audio",
    "audio-streams",
    "is-custom-pid",
    "opt",
    "is-media-hub",
];

const typeSpecificStreamServerPayloadKeys = {
    120: ["latency", "bandwidth", "conn-timeout", "retry-duration", "aes", "aes-word", "stream-id", "mtu", "token", "event-data"],
    121: ["max-connections", "latency", "bandwidth", "aes", "aes-word", "mtu", "token", "event-data"],
    132: ["mtu", "pmt-pid", "pcr-pid", "video-pid", "audio-pid", "audio-pids"],
    133: ["mtu", "pmt-pid", "pcr-pid", "video-pid", "audio-pid", "audio-pids"],
};

const getStreamServerPayloadKeys = (serverSettings) => {
    const type = Number(serverSettings?.type);
    const typeSpecificKeys = typeSpecificStreamServerPayloadKeys[type] || [];
    return [...commonStreamServerPayloadKeys, ...typeSpecificKeys];
};

const buildStreamServerPayload = (serverSettings) => {
    return pickDefined(serverSettings, getStreamServerPayloadKeys(serverSettings));
};

const hasStreamServerPayloadChanged = (previousPayload, nextPayload) => {
    return hasPayloadChanged(previousPayload, nextPayload);
};

module.exports = {
    buildStreamServerPayload,
    hasStreamServerPayloadChanged,
};
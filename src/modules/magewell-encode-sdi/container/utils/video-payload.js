"use strict";

const { pickDefined } = require("@utils/payload-utils");

const mainVideoPayloadKeys = [
    "is-auto",
    "codec",
    "cx",
    "cy",
    "duration",
    "kbps",
    "gop",
    "fourcc",
    "profile",
    "cbrstat",
    "fullrange",
    "is-vbr",
    "min-vbr-qp",
    "max-vbr-qp",
    "is-time-code-sei",
    "is-closed-caption-sei",
    "ar-convert-mode",
    "rotation",
    "mirroring",
];

const subVideoPayloadKeys = [
    "enable",
    "codec",
    "cx",
    "cy",
    "duration",
    "kbps",
    "gop",
    "fourcc",
    "profile",
    "cbrstat",
    "fullrange",
    "is-vbr",
    "min-vbr-qp",
    "max-vbr-qp",
    "is-time-code-sei",
    "ar-convert-mode",
    "rotation",
    "mirroring",
    "is-auto",
];

const buildVideoPayload = (streamSettings, streamIndex) => {
    const payloadKeys = streamIndex === 1 ? subVideoPayloadKeys : mainVideoPayloadKeys;
    const payload = {
        stream: streamIndex,
        ...pickDefined(streamSettings, payloadKeys),
    };

    if (streamSettings?.crop !== undefined) {
        payload.crop = JSON.stringify(streamSettings.crop);
    }

    // Sub stream requires explicit custom mode in browser requests.
    if (streamIndex === 1 && payload["is-auto"] === undefined) {
        payload["is-auto"] = 0;
    }

    // Match browser behavior for sub stream: CBR mode payload.
    if (streamIndex === 1) {
        payload["is-vbr"] = 0;
        if (payload["min-vbr-qp"] === undefined) {
            payload["min-vbr-qp"] = 0;
        }
        if (payload["max-vbr-qp"] === undefined) {
            payload["max-vbr-qp"] = 0;
        }
    }

    return payload;
};

module.exports = {
    buildVideoPayload,
};
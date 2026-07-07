"use strict";

const pickDefined = (source, keys) => {
    const payload = {};

    for (const key of keys) {
        if (source?.[key] !== undefined) {
            payload[key] = source[key];
        }
    }

    return payload;
};

const arePayloadValuesEqual = (left, right) => {
    if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
            return false;
        }

        for (let i = 0; i < left.length; i++) {
            if (left[i] !== right[i]) {
                return false;
            }
        }

        return true;
    }

    return left === right;
};

const hasPayloadChanged = (previousPayload, nextPayload) => {
    if (!previousPayload) {
        return true;
    }

    const payloadKeys = new Set([...Object.keys(previousPayload), ...Object.keys(nextPayload)]);
    for (const key of payloadKeys) {
        if (!arePayloadValuesEqual(previousPayload[key], nextPayload[key])) {
            return true;
        }
    }

    return false;
};

module.exports = {
    pickDefined,
    arePayloadValuesEqual,
    hasPayloadChanged,
};
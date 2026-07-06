"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

const isPlainObject = (value) => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};

const deepMerge = (base, patch) => {
    if (!isPlainObject(base)) {
        return isPlainObject(patch) ? { ...patch } : patch;
    }

    const merged = { ...base };
    for (const [key, patchValue] of Object.entries(patch || {})) {
        const baseValue = merged[key];
        if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
            merged[key] = deepMerge(baseValue, patchValue);
            continue;
        }

        merged[key] = patchValue;
    }

    return merged;
};

module.exports = async () => {
    const codecData = (await mongoSingle.get("settings")) || {};
    let deviceId;
    try {
        deviceId = await deviceIdGet();
    } catch (error) {
        return codecData;
    }

    const localData = (await mongoSingle.get(`localdata_${deviceId}`)) || {};

    return deepMerge(codecData, localData);
};
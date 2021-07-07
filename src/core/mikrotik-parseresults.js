"use strict";

const formatBps = require("@core/format-bps");

const parseTime = (timeString) => {
    const timeParserFields = {
        s: 1,
        m: 1 * 60,
        h: 1 * 60 * 60,
        d: 1 * 60 * 60 * 24,
        w: 1 * 60 * 60 * 24 * 7,
    };

    let timeSeconds = 0;
    for (const [eachField, eachFieldValue] of Object.entries(timeParserFields)) {
        const regex = new RegExp(`([0-9]+)${eachField}`);
        const result = timeString.match(regex);
        if (result && result[1]) {
            timeSeconds += parseInt(result[1]) * eachFieldValue;
        }
    }
    return timeSeconds;
};

module.exports = ({
    result,
    integerFields = [],
    booleanFields = [],
    timeFields = [],
    arrayFields = [],
    deleteFields = [],
    bitrateFields = [],
}) => {
    for (var i in timeFields) {
        if (timeFields[i] in result) {
            result[timeFields[i]] = parseTime(result[timeFields[i]]) ?? 0;
        }
    }

    for (var i in booleanFields) {
        if (booleanFields[i] in result) {
            result[booleanFields[i]] = result[booleanFields[i]] === "true" || result[booleanFields[i]] === "yes";
        }
    }

    for (var i in integerFields) {
        if (integerFields[i] in result) {
            result[integerFields[i]] = parseInt(result[integerFields[i]]) ?? 0;
        }
    }

    for (var i in arrayFields) {
        if (arrayFields[i] in result) {
            result[arrayFields[i]] = result[arrayFields[i]].split(",");
        }
    }

    for (var i in deleteFields) {
        if (deleteFields[i] in result) {
            delete result[deleteFields[i]];
        }
    }

    for (var i in bitrateFields) {
        if (bitrateFields[i] in result) {
            result[`${i}-text`] = formatBps(bitrateFields[i]);
        }
    }

    if (result[".id"]) {
        // overwrite '.id' field with 'id'
        result["id"] = result[".id"];
        delete result[".id"];
    }

    // add timestamp
    result["timestamp"] = Date.now();
    return result;
};

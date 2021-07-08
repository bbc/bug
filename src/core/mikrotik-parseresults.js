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
    for (const eachField of timeFields) {
        if (eachField in result) {
            result[eachField] = parseTime(result[eachField]) ?? 0;
        }
    }

    for (const eachField of booleanFields) {
        if (eachField in result) {
            result[eachField] = result[eachField] === "true" || result[eachField] === "yes";
        }
    }

    for (const eachField of integerFields) {
        if (eachField in result) {
            result[eachField] = parseInt(result[eachField]) ?? 0;
        }
    }

    for (const eachField of arrayFields) {
        if (eachField in result) {
            result[eachField] = result[eachField].split(",");
        }
    }

    for (const eachField of deleteFields) {
        if (eachField in result) {
            delete result[eachField];
        }
    }

    for (const eachField of bitrateFields) {
        if (eachField in result) {
            result[`${eachField}-text`] = formatBps(parseInt(result[eachField]));
        }
    }

    if (result[".id"]) {
        // overwrite '.id' field with 'id'
        result["id"] = result[".id"];
        delete result[".id"];
    }

    // add timestamp
    result["timestamp"] = new Date();
    return result;
};

"use strict";

/**
 * core/regex-matchany.js
 * Matches any of the regexes in an array
 * 0.0.1 29/11/2021 - Created first version (GH)
 */

module.exports = (regexes, value) => {
    const checkRegex = (regexes, value) => {
        for (let eachRegex of regexes) {
            if (eachRegex.test(value)) {
                return true;
            }
        }
        return false;
    };

    if (!Array.isArray(value)) {
        return checkRegex(regexes, value);
    }

    for (let eachValue of value) {
        if (checkRegex(regexes, eachValue)) {
            return true;
        }
    }
    return false;
};

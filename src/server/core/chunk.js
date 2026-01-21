"use strict";

/**
 * core/chunk.js
 * Splits a string into chunks of a given size
 * 0.0.1 30/11/2021 - Created first version (GH)
 */

module.exports = (str, size) => {
    return str.match(new RegExp(".{1," + size + "}", "g"));
};

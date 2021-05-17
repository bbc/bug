"use strict";

/**
 * core/StatusItem.js
 * A simple class to make sure all fields are filled in - use in status endpoint for containers
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

module.exports = class StatusItem {
    constructor({ key, message, type }) {
        this.key = key;
        this.message = message;
        this.type = type;
        this.timestamp = Date.now();
    }
};

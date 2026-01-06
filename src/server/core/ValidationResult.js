"use strict";

/**
 * core/ValidationResult.js
 * A simple class to make sure all fields are filled in - use in live validation endpoints to generate a valid response
 * 0.0.1 24/05/2021 - Created first version (GH)
 */

module.exports = class ValidationResult {
    constructor(results) {
        if (!Array.isArray(results)) {
            throw new Error(`ValidationResult does not contain a valid results array: ${JSON.stringify(results)}`);
        }

        for (let eachResult of results) {
            if (eachResult["state"] !== true && eachResult["state"] !== false) {
                throw new Error(
                    `ValidationResult results array must contain an valid state for each item with the value TRUE or FALSE`
                );
            }
            if (!eachResult["field"]) {
                throw new Error(`ValidationResult results array must contain a valid field for each item`);
            }
            if (eachResult["message"] === undefined) {
                throw new Error(
                    `ValidationResult results array must contain a message for each item (it can be empty)`
                );
            }
        }

        this.validationResults = results;
    }
};

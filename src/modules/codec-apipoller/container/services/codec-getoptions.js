"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

module.exports = async (fieldName = null) => {
    try {
        let codecs = await mongoSingle.get("codecs");

        const uniqueValues = [];
        if (Array.isArray(codecs) && fieldName) {
            for (let eachCodec of codecs) {
                const fieldValue = getValueByPath(eachCodec, fieldName);

                if (Array.isArray(fieldValue)) {
                    for (let eachValue of fieldValue) {
                        if (!uniqueValues.includes(eachValue)) {
                            uniqueValues.push(eachValue);
                        }
                    }
                } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== "") {
                    if (!uniqueValues.includes(fieldValue)) {
                        uniqueValues.push(fieldValue);
                    }
                }
            }
        }

        return uniqueValues.sort();
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};

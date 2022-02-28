"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (fieldName = null) => {
    let codecs = await mongoSingle.get("codecs");

    const uniqueValues = [];
    if (codecs && fieldName) {
        for (let eachCodec of codecs) {
            for (let eachValue of eachCodec[fieldName]) {
                if (!uniqueValues.includes(eachValue)) {
                    uniqueValues.push(eachValue);
                }
            }
        }
    }
    return uniqueValues.sort();
};

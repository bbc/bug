"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const labelObjects = await mongoSingle.get("routerlabels");
        const returnArray = [];
        if (labelObjects) {
            for (let eachLabel of labelObjects) {
                returnArray[eachLabel.outputIndex] = eachLabel.outputLabel;
            }
        }
        return returnArray;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};

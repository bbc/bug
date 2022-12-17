"use strict";

const speedtest = require("../utils/speedtest");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (resultsLimit = 10) => {
    try {
        const testCollection = await mongoCollection("test-results");
        const results = await testCollection
            .find({}, { sort: { timestamp: -1 } })
            .limit(parseInt(resultsLimit))
            .toArray();
        return { data: results };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};

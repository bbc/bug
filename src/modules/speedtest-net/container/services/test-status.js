"use strict";

const speedtest = require("../utils/speedtest");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const testCollection = await mongoCollection("test-results");
        const result = await testCollection.findOne({}, { sort: { timestamp: -1 } });
        return { data: result };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};

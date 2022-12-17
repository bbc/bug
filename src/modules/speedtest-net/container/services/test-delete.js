"use strict";

const speedtest = require("../utils/speedtest");
const mongoCollection = require("@core/mongo-collection");
const ObjectId = require("mongodb").ObjectID;

module.exports = async (id) => {
    try {
        const testCollection = await mongoCollection("test-results");
        const { deletedCount } = await testCollection.deleteOne({ _id: ObjectId(id) });
        return { data: { deletedCount: deletedCount } };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};

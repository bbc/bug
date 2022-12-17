"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const dataCollection = await mongoCollection("data");
        const sourceCollection = await mongoCollection("sources");

        let source = await dataCollection.find({}).sort({ timestamp: -1 }).limit(1).toArray();
        source = source[0];

        source = await sourceCollection.findOne({ label: source?.ndi?.name });

        if (sourceCollection) {
            return source;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

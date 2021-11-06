"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const dataCollection = await mongoCollection("data");

        let source = await dataCollection.find({}).sort({ timestamp: -1 }).limit(1).toArray();
        source = source[0];

        if (typeof source?.ndi?.name === "string" || source?.ndi?.name instanceof String) {
            return source?.ndi?.name;
        }

        return null;
    } catch (error) {
        return undefined;
    }
};

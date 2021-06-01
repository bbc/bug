"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const outputsCollection = await mongoCollection("outputs");
        const outputs = await outputsCollection.find().toArray();

        if (outputs.length < 1) {
            return {
                error: "Could not retieve output",
                status: "error",
                data: outputs,
            };
        }
        return { status: "success", data: outputs };
    } catch (error) {
        return null;
    }
};

"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const query = {
            number: Math.round(index),
        };

        const outputsCollection = await mongoCollection("outputs");
        const output = await outputsCollection.findOne(query);

        if (!output) {
            return {
                error: "Could not retieve output",
                status: "failure",
                data: output,
            };
        }
        return { status: "success", data: output };
    } catch (error) {
        return { status: "failure", error: error };
    }
};

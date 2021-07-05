"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const systemCollection = await mongoCollection("system");
        const system = await systemCollection.find().toArray();

        if (system.length < 1) {
            return {
                error: "Could not retieve system stats",
                status: "error",
                data: outputs,
            };
        }
        return { status: "success", data: system };
    } catch (error) {
        return { status: "failure", error: error };
    }
};

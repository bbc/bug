"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const systemCollection = await mongoCollection("system");
        const system = await systemCollection.find().toArray();

        if (system.length < 1) {
            return {
                error: "Could not retieve output",
                status: "error",
                data: outputs,
            };
        }
        return { status: "success", data: system };
    } catch (error) {
        return null;
    }
};

"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (identifier) => {
    try {
        const sputniksCollection = await mongoCollection("sputniks");
        const sputnik = await sputniksCollection.findOne({
            identifier: identifier,
        });

        if (!sputnik) {
            return {
                error: "Could not retieve sputnik",
                status: "error",
                data: sputnik,
            };
        }
        return { status: "success", data: sputnik };
    } catch (error) {
        return null;
    }
};

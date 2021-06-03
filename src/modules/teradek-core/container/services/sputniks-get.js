"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const sputniksCollection = await mongoCollection("sputniks");
        const sputniks = await sputniksCollection.find().toArray();

        if (!sputniks) {
            return {
                error: "Could not retieve sputniks",
                status: "error",
                data: sputniks,
            };
        }
        return { status: "success", data: sputniks };
    } catch (error) {
        return null;
    }
};

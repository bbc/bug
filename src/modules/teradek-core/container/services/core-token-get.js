"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const token = await tokenCollection.findOne();

        if (!token) {
            return {
                error: "Could not retieve output",
                status: "error",
                data: token,
            };
        }
        return { status: "success", data: token };
    } catch (error) {
        return null;
    }
};

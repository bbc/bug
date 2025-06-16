"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {

    const statusItems = [];

    const sources = await mongoSingle.get("sources");
    if (!sources) {
        statusItems.push(
            new StatusItem({
                key: `db_sources`,
                message: "No source data found in database",
                type: "warning",
            })
        );
    }

    const destinations = await mongoSingle.get("destinations");
    if (!destinations) {
        statusItems.push(
            new StatusItem({
                key: `db_destinations`,
                message: "No destination data found in database",
                type: "warning",
            })
        );
    }

    const routesCollection = await mongoCollection("routes");
    if (!await routesCollection.find().toArray()) {
        statusItems.push(
            new StatusItem({
                key: `db_routes`,
                message: "No route data found in database",
                type: "warning",
            })
        );
    }
    return statusItems;
};

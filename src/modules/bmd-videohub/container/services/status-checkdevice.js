"use strict";

const mongoCollection = require("@core/mongo-collection");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {

    const dataCollection = await mongoCollection("data");

    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    const sourceCount = Object.keys(dbInputLabels?.data)?.length ?? 0;

    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    const destinationCount = Object.keys(dbOutputLabels?.data)?.length ?? 0;


    return new StatusItem({
        message: `Device active with ${sourceCount} source(s) and ${destinationCount} destination(s)`,
        key: "deviceactive",
        type: "default",
        flags: [],
    })
}

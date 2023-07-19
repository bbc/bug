"use strict";

const StatusItem = require("@core/StatusItem");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // fetch list of interfaces which have an 'unknown' SFP
    const interfaces = await interfacesCollection.find({ interfaceType: "Unknown" }).toArray();
    if (interfaces) {
        return interfaces.map(
            (i) =>
                new StatusItem({
                    key: `intType${i.interfaceId}`,
                    message: `The SFP type of ${i.interfaceId} is 'Unknown'`,
                    type: "warning",
                })
        );
    }
    return [];
};

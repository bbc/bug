"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {
    // get loaded program so we can show connections in the right order
    const loadedProgram = await mongoSingle.get("loadedProgram");

    // and a list of collections (containing the data we want)
    const connectionsCollection = await mongoCollection("connections");
    const connections = await connectionsCollection.find().toArray();

    const statusItems = [];

    if (loadedProgram?.groups) {
        for (const eachGroup of loadedProgram?.groups) {
            for (const eachConnection of eachGroup?.connections) {
                // we're using the id as it works on TX and RX
                const activeConnection = connections.find((c) => {
                    return c.id === eachConnection.id;
                });
                if (activeConnection && activeConnection.state !== "Idle") {
                    const directionArray = [];

                    if (activeConnection.remoteLinkQuality < 95) {
                        directionArray.push("TX");
                    }
                    if (activeConnection.localLinkQuality < 95) {
                        directionArray.push("RX");
                    }
                    if (directionArray.length > 0) {
                        statusItems.push(
                            new StatusItem({
                                key: `linkquality`,
                                message: [
                                    `${directionArray.join("/")} link quality is low for ${eachGroup?.name} ${
                                        eachConnection?._tabName
                                    }`,
                                ],
                                type: "warning",
                            })
                        );
                    }
                }
            }
        }
    }
    return statusItems;
};

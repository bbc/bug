"use strict";

const mongoSingle = require("@core/mongo-single");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    // fetch list of active connections
    const connectionsCollection = await mongoCollection("connections");
    const connections = await connectionsCollection.find().toArray();

    // now fetch info about the currently loaded program
    const loadedProgram = await mongoSingle.get("loadedProgram");

    // now add connected state to any connections
    let deviceConnected = false;
    if (loadedProgram.groups) {
        for (let eachGroup of loadedProgram.groups) {
            let groupConnected = true;
            for (let eachConnection of eachGroup.connections) {
                const activeConnection = connections.find((c) => c.handle === eachConnection.cxnHandle);
                eachConnection["_connected"] = activeConnection?.state === "Connected";
                eachConnection["_connecting"] = activeConnection?.state === "Connecting";
                eachConnection["state"] = activeConnection?.state ? activeConnection?.state : "Idle";
                groupConnected = groupConnected && eachConnection["_connected"];
            }
            eachGroup["_connected"] = groupConnected;
            deviceConnected = deviceConnected && eachGroup["_connected"];
        }
    }
    loadedProgram["_connected"] = deviceConnected;

    return loadedProgram;
};

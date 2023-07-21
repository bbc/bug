"use strict";

const mongoSingle = require("@core/mongo-single");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    // fetch list of active connections
    const connectionsCollection = await mongoCollection("connections");
    const connections = await connectionsCollection.find().toArray();

    // now fetch info about the currently loaded program
    let loadedProgram = await mongoSingle.get("loadedProgram");

    // if loadedProgram is empty, return null
    if (!loadedProgram || Object.keys(loadedProgram).length === 0) {
        return null;
    }

    // now add connected state to any connections
    let deviceConnected = false;
    if (loadedProgram.groups) {
        for (let eachGroup of loadedProgram.groups) {
            let groupConnected = true;
            let groupAnyConnected = false;
            for (let eachConnection of eachGroup.connections) {
                const activeConnection = connections.find((c) => c.id === eachConnection.id);
                eachConnection["localLinkQuality"] = activeConnection?.localLinkQuality;
                eachConnection["remoteLinkQuality"] = activeConnection?.remoteLinkQuality;
                eachConnection["_destination"] = activeConnection?.destination;
                eachConnection["_connected"] = activeConnection?.state === "Connected";
                eachConnection["_connecting"] = activeConnection?.state === "Connecting";
                eachConnection["state"] = activeConnection?.state ? activeConnection?.state : "Idle";
                groupConnected = groupConnected && eachConnection["_connected"];
                groupAnyConnected = groupAnyConnected || eachConnection["_connected"];
            }
            eachGroup["_connected"] = groupConnected;
            eachGroup["_anyconnected"] = groupAnyConnected;
            deviceConnected = deviceConnected && eachGroup["_connected"];
        }
        loadedProgram["_connected"] = deviceConnected;
    }

    if (loadedProgram.length === 0) {
        return null;
    }
    return loadedProgram;
};

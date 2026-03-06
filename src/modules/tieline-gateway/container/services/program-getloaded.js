"use strict";

const mongoSingle = require("@core/mongo-single");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
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
        let deviceConnected = true;
        const groups = Array.isArray(loadedProgram.groups) ? loadedProgram.groups : [];

        for (const eachGroup of groups) {
            let groupConnected = true;
            let groupAnyConnected = false;

            const groupConnections = Array.isArray(eachGroup.connections) ? eachGroup.connections : [];

            for (const eachConnection of groupConnections) {
                const activeConnection = connections.find((c) => c.id === eachConnection.id);

                eachConnection["localLinkQuality"] = activeConnection?.localLinkQuality;
                eachConnection["remoteLinkQuality"] = activeConnection?.remoteLinkQuality;
                eachConnection["_destination"] = activeConnection?.destination;
                eachConnection["_connected"] = activeConnection?.state === "Connected";
                eachConnection["_connecting"] = activeConnection?.state === "Connecting";
                eachConnection["state"] = activeConnection?.state || "Idle";

                groupConnected = groupConnected && eachConnection["_connected"];
                groupAnyConnected = groupAnyConnected || eachConnection["_connected"];
            }

            eachGroup["_connected"] = groupConnected;
            eachGroup["_anyconnected"] = groupAnyConnected;
            deviceConnected = deviceConnected && groupConnected;
        }

        loadedProgram["_connected"] = deviceConnected;

        // if loadedProgram has no groups, return null
        if (groups.length === 0) {
            return null;
        }

        return loadedProgram;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
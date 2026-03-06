"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        // get loaded program so we can show connections in the right order
        const loadedProgram = await mongoSingle.get("loadedProgram");
        if (!loadedProgram) {
            throw new Error(`failed to load program`);
        }

        // and now the stats (what we actually want!)
        const statisticsCollection = await mongoCollection("statistics");
        const statisticsFromDb = await statisticsCollection.find().toArray();

        // and lastly fetch the list of active connections
        const connectionsCollection = await mongoCollection("connections");
        const connections = await connectionsCollection.find().toArray();

        const statisticsArray = [];

        const groups = Array.isArray(loadedProgram.groups) ? loadedProgram.groups : [];

        for (const eachGroup of groups) {
            // add group first
            const activeGroupStats = statisticsFromDb.find((c) => c.id === eachGroup.id);

            if (activeGroupStats) {
                statisticsArray.push({
                    id: activeGroupStats.id,
                    type: "group",
                    name: eachGroup._title,
                    "stats-10m": activeGroupStats["ten-minutes-aggregate"],
                    "stats-1m": activeGroupStats["minute-aggregate"],
                    "stats-total": activeGroupStats["total-aggregate"],
                });
            }

            const groupConnections = Array.isArray(eachGroup.connections) ? eachGroup.connections : [];

            for (const eachConnection of groupConnections) {
                // we're using the id as it works on TX and RX
                const activeConnection = connections.find((c) => c.id === eachConnection.id);

                const connectionStats = {
                    id: eachConnection.id,
                    type: "connection",
                    name: eachConnection.name,
                    _tabName: eachConnection._tabName,
                    state: activeConnection ? activeConnection.state : "Idle",
                    _group: eachGroup._title,
                    destination: eachConnection.destination,
                    audioPort: eachConnection.audioPort,
                    via: eachConnection.via,
                };

                if (activeConnection?.state === "Connected") {
                    // find stats - we're using the id as it works on TX and RX
                    const fullStats = statisticsFromDb.find((s) => s.connectionId === eachConnection.id);
                    if (fullStats) {
                        connectionStats["stats-10m"] = fullStats["stats-10m"];
                        connectionStats["stats-1m"] = fullStats["stats-1m"];
                        connectionStats["stats-total"] = fullStats["stats-total"];
                    }
                }

                statisticsArray.push(connectionStats);
            }
        }

        return statisticsArray;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
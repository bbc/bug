"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");

module.exports = async (data) => {
    // get loaded program so we can show connections in the right order
    const loadedProgram = await mongoSingle.get("loadedProgram");

    // and now the stats (what we actually want!)
    const statisticsCollection = await mongoCollection("statistics");
    const statisticsFromDb = await statisticsCollection.find({ type: "connection" }).toArray();

    // and lastly fetch the list of active connections
    const connectionsCollection = await mongoCollection("connections");
    const connections = await connectionsCollection.find().toArray();

    const statisticsArray = [];
    if (loadedProgram?.groups) {
        for (const eachGroup of loadedProgram?.groups) {
            for (const eachConnection of eachGroup?.connections) {
                // find out whether it's connected
                const activeConnection = connections.find((c) => c.handle === eachConnection.cxnHandle);
                console.log(eachConnection);
                const connectionStats = {
                    id: eachConnection.id,
                    name: eachConnection.name,
                    _tabName: eachConnection._tabName,
                    state: activeConnection ? activeConnection.state : "Idle",
                    _group: eachGroup._title,
                    destination: eachConnection.destination,
                    audioPort: eachConnection.audioPort,
                };
                if (activeConnection?.state === "Connected") {
                    // find stats
                    const fullStats = statisticsFromDb.find((s) => s.connectionHandle === eachConnection.cxnHandle);
                    if (fullStats) {
                        connectionStats["stats-10m"] = fullStats["stats-10m"];
                        connectionStats["stats-1m"] = fullStats["stats-1m"];
                        connectionStats["stats-total"] = fullStats["stats-total"];
                    }
                }
                statisticsArray.push(connectionStats);
            }
        }
    }
    return statisticsArray;
};

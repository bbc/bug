"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");

module.exports = async (connectionId) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // so .. we're going to have a go at working around this lack-of-feature in Tieline Gateways.
    // apparently they're considering adding single-connections as an enhancement as of Jul 2023.
    // for the moment we're going to work out what's connected (or not idle) ... connect all ... then disconnect the ones we don't want.
    // Eugh.

    // get the loaded program
    const loadedProgram = await mongoSingle.get("loadedProgram");

    // find our connectionId in the program
    let selectedGroup = null;
    for (let eachGroup of loadedProgram.groups) {
        for (let eachConnection of eachGroup.connections) {
            if (eachConnection.id === connectionId) {
                selectedGroup = eachGroup;
                break;
            }
        }
    }

    if (!selectedGroup) {
        console.log(`connection-connect: cannot find connection id ${connectionId}`);
        return false;
    }

    // now we have the group we can find all other connections
    const allGroupConnections = selectedGroup.connections.filter((c) => c.id !== connectionId).map((c) => c.id);

    // now check the connections database to remove any already-connected ones
    const connectionsCollection = await mongoCollection("connections");
    const activeConnections = await connectionsCollection.find({ groupId: selectedGroup.id }).toArray();

    const connectionIdsToDisconnect = allGroupConnections.filter((c) => {
        const activeConnection = activeConnections.find((ac) => ac.id === c);
        return !activeConnection || activeConnection.state === "Idle" || activeConnection.state === "Disconnected";
    });

    try {
        const TielineApi = new tielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        console.log(`connection-connect: connecting to ${connectionId}`);

        await TielineApi.post("/api/connect", {
            "cxn-id": connectionId,
        });

        // now disconnect connections we don't need
        for (const eachConnectionId of connectionIdsToDisconnect) {
            console.log(`connection-connect: disconnecting ${eachConnectionId}`);
            await TielineApi.post("/api/disconnect", {
                "cxn-id": eachConnectionId,
            });
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (connectionId) => {

    try {
        if (!connectionId) {
            throw new Error(`${serviceName}: invalid connectionId`);
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // so .. we're going to have a go at working around this lack-of-feature in tieline gateways.
        // apparently they're considering adding single-connections as an enhancement as of jul 2023.
        // for the moment we're going to work out what's connected (or not idle) ... connect all ... then disconnect the ones we don't want.
        // eugh.

        // get the loaded program
        const loadedProgram = await mongoSingle.get("loadedProgram");
        if (!loadedProgram) {
            throw new Error(`${serviceName}: loaded program not found`);
        }

        const groups = Array.isArray(loadedProgram.groups) ? loadedProgram.groups : [];

        // find our connectionId in the program
        let selectedGroup = null;

        for (const eachGroup of groups) {
            const connections = Array.isArray(eachGroup?.connections) ? eachGroup.connections : [];

            for (const eachConnection of connections) {
                if (eachConnection?.id === connectionId) {
                    selectedGroup = eachGroup;
                    break;
                }
            }

            if (selectedGroup) break;
        }

        if (!selectedGroup) {
            logger.warning(`cannot find connection id ${connectionId}`);
            return false;
        }

        // now we have the group we can find all other connections
        const groupConnections = Array.isArray(selectedGroup.connections) ? selectedGroup.connections : [];

        const allGroupConnections = groupConnections
            .filter((c) => c?.id !== connectionId)
            .map((c) => c.id);

        // now check the connections database to remove any already-connected ones
        const connectionsCollection = await mongoCollection("connections");
        const activeConnections = await connectionsCollection
            .find({ groupId: selectedGroup.id })
            .toArray();

        const connectionIdsToDisconnect = allGroupConnections.filter((c) => {
            const activeConnection = activeConnections.find((ac) => ac.id === c);
            return (
                !activeConnection ||
                activeConnection.state === "Idle" ||
                activeConnection.state === "Disconnected"
            );
        });

        const tielineApi = new TielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        logger.info(`connecting to ${connectionId}`);

        await tielineApi.post("/api/connect", {
            "cxn-id": connectionId,
        });

        // now disconnect connections we don't need
        for (const eachConnectionId of connectionIdsToDisconnect) {
            logger.info(`disconnecting ${eachConnectionId}`);

            await tielineApi.post("/api/disconnect", {
                "cxn-id": eachConnectionId,
            });
        }

        logger.info(`completed successfully`);

        return true;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
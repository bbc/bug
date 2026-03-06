"use strict";

const fetchConnections = require("@utils/fetch-connections");
const logger = require("@core/logger")(module);

const parseNullInt = (val) => {
    const num = Number(val);
    return Number.isNaN(num) ? null : parseInt(val, 10);
};

module.exports = async ({ tielineApi, event, connectionsCollection }) => {
    if (!event?.["cxn-status"]) return false;

    const status = event["cxn-status"];
    const connectionId = status?._attributes?.["cxn-id"];
    if (!connectionId) return false;

    const state = status?.["CXN_STATE"]?._text;

    if (state === "Unavailable") {
        await connectionsCollection.deleteOne({ id: connectionId });
        logger.warning(`connection id ${connectionId} is marked 'unavailable' - removed from db`);
        return true;
    }

    const existing = await connectionsCollection.findOne({ id: connectionId });
    if (!existing) {
        logger.info(`connection ${connectionId} not found - fetching all details`);
        await fetchConnections({ tielineApi, connectionsCollection });
        return true;
    }

    const connectionUpdate = {
        id: connectionId,
        localLinkQuality: parseNullInt(status?.["LOCAL_LINK_QUALITY"]?._text),
        remoteLinkQuality: parseNullInt(status?.["REMOTE_LINK_QUALITY"]?._text),
    };

    if (state) connectionUpdate.state = state;

    await connectionsCollection.updateOne(
        { id: connectionId },
        { $set: connectionUpdate },
        { upsert: false }
    );

    return true;
};
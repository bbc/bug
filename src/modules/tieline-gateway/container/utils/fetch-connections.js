"use strict";

const ensureArray = require("@utils/ensure-array");
const logger = require("@core/logger")(module);

const parseNullInt = (val) => (!isNaN(val) ? parseInt(val) : 0);

// this service fetches connections from the device, and stores them in the db
// it's called from the connections worker, and in response to a notification
module.exports = async ({ tielineApi, connectionsCollection }) => {

    const connectionsResult = await tielineApi.get("/api/get_cxns");

    const handles = ensureArray(connectionsResult?.result?.["cxn-handle"])
        .map((c) => c?._text)
        .filter(Boolean);

    if (!handles.length) {
        logger.debug(`no connections found - removing from database`);
        await connectionsCollection.deleteMany({});
        return;
    }

    logger.debug(`found ${handles.length} connection(s)`);

    // fetch connection states in parallel
    const stateResults = await Promise.all(
        handles.map(async (handle) => {
            try {
                const stateResult = await tielineApi.get(
                    `/api/get_cxn_live_properties?cxn-handle=${encodeURIComponent(handle)}`
                );

                const prop = stateResult?.result?.["cxn-live-prop"];
                const attrs = prop?._attributes;

                if (!attrs?.["cxn-id"]) {
                    return { handle, delete: true };
                }

                return {
                    handle,
                    connection: {
                        id: attrs["cxn-id"],
                        groupId: attrs["group-id"],
                        answering: parseNullInt(prop?.ANSWERING?._text),
                        callerId: prop?.CALLER_ID?._text,
                        cxnBitrate: parseNullInt(prop?.CXN_BITRATE?._text),
                        destination: prop?.DESTINATION?._text,
                        state: prop?.CXN_STATE?._text,
                        localLinkQuality: parseNullInt(prop?.LOCAL_LINK_QUALITY?._text),
                        remoteLinkQuality: parseNullInt(prop?.REMOTE_LINK_QUALITY?._text),
                        handle,
                        timestamp: new Date(),
                    },
                };
            } catch (error) {
                logger.error(`${handle} ${error}`);
                return null;
            }
        })
    );

    const bulkOps = [];

    for (const result of stateResults) {
        if (!result) continue;

        if (result.delete) {
            bulkOps.push({
                deleteOne: { filter: { handle: result.handle } },
            });
        } else {
            bulkOps.push({
                updateOne: {
                    filter: { id: result.connection.id },
                    update: { $set: result.connection },
                    upsert: true,
                },
            });
        }
    }

    if (bulkOps.length) {
        logger.debug(`writing ${bulkOps.length} operations to database`);
        await connectionsCollection.bulkWrite(bulkOps);
    }
};
"use strict";

const ensureArray = require("@utils/ensure-array");
const mongoCollection = require("@core/mongo-collection");

const parseNullInt = (val) => {
    if (!isNaN(val)) {
        return parseInt(val);
    }
    return 0;
};

// this service fetches connections from the device, and stores them in the db
// it's called from the connections worker, and in response to a notification
module.exports = async (TielineApi) => {
    const connectionsCollection = await mongoCollection("connections");

    // fetch the connections
    const connectionsResult = await TielineApi.get("/api/get_cxns");

    let connectionHandles = [];
    if (connectionsResult) {
        // connection handle could be an array (multiple)
        connectionHandles = ensureArray(connectionsResult["result"]["cxn-handle"]).map((each) => each?._text);
    }

    if (!connectionsResult["result"]["cxn-handle"]) {
        // no current connections - remove them from the DB
        console.log(`fetch-connections: no connections found - removing from database`);
        await connectionsCollection.deleteMany({});
        return;
    }

    console.log(`fetch-connections: found ${connectionHandles.length} connection(s) - updating database`);

    for (const eachConnectionHandle of connectionHandles) {
        const connectionArray = {};
        connectionArray["handle"] = eachConnectionHandle;

        try {
            if (eachConnectionHandle) {
                const stateResult = await TielineApi.get(
                    `/api/get_cxn_live_properties?cxn-handle=${encodeURIComponent(eachConnectionHandle)}`
                );
                if (stateResult && stateResult?.["result"]?.["cxn-live-prop"]?.["_attributes"]?.["cxn-id"]) {
                    connectionArray["id"] = stateResult?.["result"]?.["cxn-live-prop"]?.["_attributes"]?.["cxn-id"];
                    connectionArray["groupId"] =
                        stateResult?.["result"]?.["cxn-live-prop"]?.["_attributes"]?.["group-id"];
                    connectionArray["answering"] = parseNullInt(
                        stateResult?.["result"]?.["cxn-live-prop"]?.["ANSWERING"]?.["_text"]
                    );
                    connectionArray["callerId"] = stateResult?.["result"]?.["cxn-live-prop"]?.["CALLER_ID"]?.["_text"];
                    connectionArray["cxnBitrate"] = parseNullInt(
                        stateResult?.["result"]?.["cxn-live-prop"]?.["CXN_BITRATE"]?.["_text"]
                    );
                    connectionArray["destination"] =
                        stateResult?.["result"]?.["cxn-live-prop"]?.["DESTINATION"]?.["_text"];
                    connectionArray["state"] = stateResult?.["result"]?.["cxn-live-prop"]?.["CXN_STATE"]?.["_text"];
                    connectionArray["localLinkQuality"] = parseNullInt(
                        stateResult?.["result"]?.["cxn-live-prop"]?.["LOCAL_LINK_QUALITY"]?.["_text"]
                    );
                    connectionArray["remoteLinkQuality"] = parseNullInt(
                        stateResult?.["result"]?.["cxn-live-prop"]?.["REMOTE_LINK_QUALITY"]?.["_text"]
                    );

                    connectionArray["timestamp"] = new Date();

                    await connectionsCollection.updateOne(
                        { id: connectionArray["id"] },
                        { $set: connectionArray },
                        { upsert: true }
                    );
                } else {
                    // remove it from the database
                    console.log(
                        `fetch-connections: connection handle ${eachConnectionHandle} not found - removing from db`
                    );
                    await connectionsCollection.deleteOne({ handle: eachConnectionHandle });
                }
            }
        } catch (error) {
            console.log(`fetch-connections: ${error}`);
        }
    }
};

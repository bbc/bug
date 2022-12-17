"use strict";

const mongoCollection = require("@core/mongo-collection");
const fetchConnections = require("@services/fetch-connections");

const parseNullInt = (val) => {
    if (!isNaN(val)) {
        return parseInt(val);
    }
    return null;
};

module.exports = async (TielineApi, data) => {
    if (data) {
        const connectionsCollection = await mongoCollection("connections");
        const connectionArray = {
            id: data?.["cxn-status"]?.["_attributes"]?.["cxn-id"],
        };

        // if connection is 'unavailable' then remove it
        if (data?.["cxn-status"]?.["CXN_STATE"]?.["_text"] === "Unavailable") {
            await connectionsCollection.deleteOne({ id: connectionArray["id"] });
            console.log(
                `process-cxnstatus: connection id ${connectionArray["id"]} is marked 'unavailable' - removing from db`
            );
        } else {
            // check if the record exists in the db
            if (!(await connectionsCollection.findOne({ id: connectionArray["id"] }))) {
                // there's nothing there - just go away and fetch the whole thing
                console.log(
                    `process-cxnstatus: connection ${connectionArray["id"]} not found - requesting all details`
                );
                await fetchConnections(TielineApi);
            } else {
                // we're good - just update the existing db entry
                connectionArray["localLinkQuality"] = parseNullInt(
                    data?.["cxn-status"]?.["LOCAL_LINK_QUALITY"]?.["_text"]
                );
                connectionArray["remoteLinkQuality"] = parseNullInt(
                    data?.["cxn-status"]?.["REMOTE_LINK_QUALITY"]?.["_text"]
                );

                // only update connection state if specified
                if (data?.["cxn-status"]?.["CXN_STATE"]?.["_text"]) {
                    connectionArray["state"] = data?.["cxn-status"]?.["CXN_STATE"]?.["_text"];
                }

                await connectionsCollection.updateOne(
                    { id: connectionArray["id"] },
                    { $set: connectionArray },
                    { upsert: false }
                );
            }
        }
        return true;
    }
    return false;
};

"use strict";

const mongoCollection = require("@core/mongo-collection");

const CACHE_ID = "state";

const getCollection = () => mongoCollection("router");

const getRecord = async () => {
    const collection = await getCollection();
    const record = await collection.findOne({ _id: CACHE_ID });
    if (!record?.data) {
        throw new Error("AJA KUMO state is not cached yet; waiting for the first device poll");
    }
    return record;
};

const get = async () => {
    const record = await getRecord();
    return record.data;
};

const setPollResult = async (state, pollStartedAt, labelsRefreshed) => {
    const collection = await getCollection();
    const shouldUpdate = {
        $lte: [{ $ifNull: ["$lastUpdated", new Date(0)] }, pollStartedAt],
    };

    await collection.updateOne(
        { _id: CACHE_ID },
        [
            {
                $set: {
                    data: { $cond: [shouldUpdate, state, "$data"] },
                    lastUpdated: { $cond: [shouldUpdate, pollStartedAt, "$lastUpdated"] },
                    timestamp: { $cond: [shouldUpdate, new Date(), "$timestamp"] },
                    labelRefreshRequested: {
                        $cond: [shouldUpdate && labelsRefreshed, false, "$labelRefreshRequested"],
                    },
                },
            },
        ],
        { upsert: true }
    );
};

const setRoute = async (destinationIndex, sourceIndex) => {
    const record = await getRecord();
    const source = record.data.sources[sourceIndex];
    const destination = record.data.destinations[destinationIndex];
    if (!source || !destination) {
        throw new Error("Cannot update AJA KUMO cache for an unknown source or destination");
    }
    if (destination.isLocked) {
        throw new Error(`AJA KUMO destination ${destinationIndex + 1} is locked`);
    }

    const collection = await getCollection();
    const now = new Date();
    await collection.updateOne(
        { _id: CACHE_ID },
        {
            $set: {
                [`data.destinations.${destinationIndex}.inputIndex`]: sourceIndex,
                [`data.destinations.${destinationIndex}.inputLabel`]: source.label,
                lastUpdated: now,
                timestamp: now,
            },
        }
    );
};

const setDestinationLock = async (destinationIndex, isLocked) => {
    const record = await getRecord();
    if (!record.data.destinations[destinationIndex]) {
        throw new Error("Cannot update AJA KUMO cache for an unknown destination");
    }

    const collection = await getCollection();
    const now = new Date();
    await collection.updateOne(
        { _id: CACHE_ID },
        {
            $set: {
                [`data.destinations.${destinationIndex}.isLocked`]: isLocked,
                lastUpdated: now,
                timestamp: now,
            },
        }
    );
};

const setLabel = async (type, index, line1, line2) => {
    if (!["source", "destination"].includes(type)) {
        throw new Error("Label type must be source or destination");
    }

    const record = await getRecord();
    const ports = type === "source" ? record.data.sources : record.data.destinations;
    const port = ports[index];
    if (!port) {
        throw new Error("Cannot update AJA KUMO cache for an unknown source or destination");
    }

    const prefix = type === "source" ? "Source" : "Destination";
    const label =
        [line1, line2]
            .map((value) => value.trim())
            .filter(Boolean)
            .join(" ") || `${prefix} ${index + 1}`;
    const updates = {
        [`data.${type === "source" ? "sources" : "destinations"}.${index}.label`]: label,
        [`data.${type === "source" ? "sources" : "destinations"}.${index}.line1`]: line1,
        [`data.${type === "source" ? "sources" : "destinations"}.${index}.line2`]: line2,
        lastUpdated: new Date(),
        timestamp: new Date(),
        labelRefreshRequested: true,
    };

    if (type === "source") {
        record.data.destinations.forEach((destination, destinationIndex) => {
            if (destination.inputIndex === index) {
                updates[`data.destinations.${destinationIndex}.inputLabel`] = label;
            }
        });
    }

    const collection = await getCollection();
    await collection.updateOne({ _id: CACHE_ID }, { $set: updates });
};

const labelRefreshRequested = async () => {
    const collection = await getCollection();
    const record = await collection.findOne({ _id: CACHE_ID }, { projection: { labelRefreshRequested: 1 } });
    return record?.labelRefreshRequested === true;
};

const clear = async () => {
    const collection = await getCollection();
    await collection.deleteOne({ _id: CACHE_ID });
};

module.exports = { get, setPollResult, setRoute, setDestinationLock, setLabel, labelRefreshRequested, clear };

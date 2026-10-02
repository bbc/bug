"use strict";

jest.mock("@core/mongo-collection", () => jest.fn());

const mongoCollection = require("@core/mongo-collection");

describe("router-cache", () => {
    let cache;
    let collection;

    beforeEach(() => {
        jest.clearAllMocks();
        collection = {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        };
        mongoCollection.mockResolvedValue(collection);
        cache = require("./router-cache");
    });

    test("reads cached router state", async () => {
        const state = { matrixSize: { sources: 16, destinations: 4 }, sources: [], destinations: [] };
        collection.findOne.mockResolvedValue({ _id: "state", data: state });

        await expect(cache.get()).resolves.toBe(state);
        expect(mongoCollection).toHaveBeenCalledWith("router");
        expect(collection.findOne).toHaveBeenCalledWith({ _id: "state" });
    });

    test("reports explicitly when the worker has not populated the cache", async () => {
        collection.findOne.mockResolvedValue(null);

        await expect(cache.get()).rejects.toThrow("waiting for the first device poll");
    });

    test("writes poll results only if no newer route update exists", async () => {
        const state = { sources: [], destinations: [] };
        const pollStartedAt = new Date("2026-01-01T00:00:00.000Z");

        await cache.setPollResult(state, pollStartedAt);

        const [, pipeline, options] = collection.updateOne.mock.calls[0];
        expect(collection.updateOne.mock.calls[0][0]).toEqual({ _id: "state" });
        expect(pipeline[0].$set.data.$cond[0]).toEqual({
            $lte: [{ $ifNull: ["$lastUpdated", new Date(0)] }, pollStartedAt],
        });
        expect(pipeline[0].$set.data.$cond.slice(1)).toEqual([state, "$data"]);
        expect(pipeline[0].$set.lastUpdated.$cond.slice(1)).toEqual([pollStartedAt, "$lastUpdated"]);
        expect(options).toEqual({ upsert: true });
    });

    test("updates cached route and label using the zero-based indexes", async () => {
        collection.findOne.mockResolvedValue({
            _id: "state",
            data: {
                sources: [
                    { index: 0, label: "Camera" },
                    { index: 1, label: "Playback" },
                ],
                destinations: [{ index: 0, label: "Monitor", inputIndex: 0, inputLabel: "Camera" }],
            },
        });

        await cache.setRoute(0, 1);

        expect(collection.updateOne).toHaveBeenCalledWith(
            { _id: "state" },
            {
                $set: expect.objectContaining({
                    "data.destinations.0.inputIndex": 1,
                    "data.destinations.0.inputLabel": "Playback",
                }),
            }
        );
    });

    test("rejects a route update for missing cached ports", async () => {
        collection.findOne.mockResolvedValue({ _id: "state", data: { sources: [], destinations: [] } });

        await expect(cache.setRoute(0, 0)).rejects.toThrow("unknown source or destination");
        expect(collection.updateOne).not.toHaveBeenCalled();
    });

    test("clears cached state when the worker starts", async () => {
        await cache.clear();

        expect(collection.deleteOne).toHaveBeenCalledWith({ _id: "state" });
    });
});

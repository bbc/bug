"use strict";

jest.mock("@core/logger", () => () => ({
    debug: jest.fn(),
    warning: jest.fn(),
}));
jest.mock("@services/router-cache", () => ({
    labelRefreshRequested: jest.fn(),
    setPollResult: jest.fn(),
}));
jest.mock("@services/kumo-api", () => ({
    getRouter: jest.fn(),
}));

const routerCache = require("@services/router-cache");
const { getRouter } = require("@services/kumo-api");
const poll = require("./router-poll");

describe("router-poll", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        routerCache.labelRefreshRequested.mockResolvedValue(false);
    });

    test("polls the configured router and caches the state with the poll start time", async () => {
        const state = { sources: Array(16).fill({}), destinations: Array(4).fill({}) };
        getRouter.mockResolvedValue(state);
        const workerData = { address: "kumo.local", port: "80", password: "" };
        const beforePoll = Date.now();

        await poll({ workerData });

        const [cachedState, pollStartedAt, labelsRefreshed] = routerCache.setPollResult.mock.calls[0];
        expect(getRouter).toHaveBeenCalledWith(workerData, { refreshLabels: false });
        expect(cachedState).toBe(state);
        expect(labelsRefreshed).toBe(false);
        expect(pollStartedAt.getTime()).toBeGreaterThanOrEqual(beforePoll);
        expect(pollStartedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test("propagates polling errors to the task manager", async () => {
        getRouter.mockRejectedValueOnce(new Error("device offline"));

        await expect(poll({ workerData: {} })).rejects.toThrow("device offline");
        expect(routerCache.setPollResult).not.toHaveBeenCalled();
    });
});

"use strict";

jest.mock("@core/logger", () => () => ({ error: jest.fn() }));
jest.mock("@services/router-cache", () => ({
    get: jest.fn(),
    setRoute: jest.fn(),
}));
jest.mock("@services/kumo-api", () => ({
    route: jest.fn(),
}));

const routerCache = require("@services/router-cache");
const { route: deviceRoute } = require("@services/kumo-api");
const routerRoute = require("./router-route");

describe("router-route", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        routerCache.get.mockResolvedValue({
            matrixSize: { sources: 32, destinations: 4 },
            destinations: Array.from({ length: 4 }, () => ({ isLocked: false })),
        });
    });

    test("routes on the device then immediately updates the cache", async () => {
        await expect(routerRoute("3", "31")).resolves.toBe(true);

        expect(deviceRoute).toHaveBeenCalledWith(3, 31, { sources: 32, destinations: 4 });
        expect(routerCache.setRoute).toHaveBeenCalledWith(3, 31);
    });

    test("does not update cache if the device route fails", async () => {
        deviceRoute.mockRejectedValueOnce(new Error("device unavailable"));

        await expect(routerRoute("0", "0")).rejects.toThrow("device unavailable");
        expect(routerCache.setRoute).not.toHaveBeenCalled();
    });

    test("does not route to a locked destination", async () => {
        routerCache.get.mockResolvedValue({
            matrixSize: { sources: 32, destinations: 4 },
            destinations: [{ isLocked: true }],
        });

        await expect(routerRoute("0", "0")).rejects.toThrow("destination 1 is locked");
        expect(deviceRoute).not.toHaveBeenCalled();
        expect(routerCache.setRoute).not.toHaveBeenCalled();
    });

    test("does not route when cached state has not been initialized", async () => {
        routerCache.get.mockRejectedValueOnce(new Error("cache is empty"));

        await expect(routerRoute("0", "0")).rejects.toThrow("cache is empty");
        expect(deviceRoute).not.toHaveBeenCalled();
    });
});

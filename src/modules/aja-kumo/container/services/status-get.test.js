"use strict";

jest.mock("@core/logger", () => () => ({ warning: jest.fn() }));
jest.mock("@core/StatusItem", () => jest.fn((value) => value));
jest.mock("@services/router-cache", () => ({
    get: jest.fn(),
}));

const StatusItem = require("@core/StatusItem");
const routerCache = require("@services/router-cache");
const statusGet = require("./status-get");

describe("status-get", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("reports cached matrix dimensions", async () => {
        routerCache.get.mockResolvedValue({
            sources: Array(32).fill({}),
            destinations: Array(4).fill({}),
        });

        await expect(statusGet()).resolves.toEqual([
            expect.objectContaining({
                message: "Connected to AJA KUMO (32 inputs, 4 outputs)",
                key: "deviceactive",
                type: "default",
            }),
        ]);
        expect(StatusItem).toHaveBeenCalledTimes(1);
    });

    test("returns no status item before the initial poll", async () => {
        routerCache.get.mockRejectedValueOnce(new Error("cache empty"));

        await expect(statusGet()).resolves.toEqual([]);
    });
});

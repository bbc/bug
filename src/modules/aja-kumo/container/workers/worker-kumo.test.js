"use strict";

jest.mock("worker_threads", () => ({
    parentPort: { postMessage: jest.fn() },
    workerData: { id: "panel-1", address: "kumo.local", port: "80", password: "secret" },
}));
jest.mock("@core/mongo-db", () => ({ connect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@core/mongo-collection", () => jest.fn().mockResolvedValue({}));
jest.mock("@core/mongo-createindex", () => jest.fn().mockResolvedValue(undefined));
jest.mock("@core/worker-taskmanager", () => jest.fn());
jest.mock("@core/logger", () => () => ({ error: jest.fn() }));
jest.mock("@services/router-cache", () => ({ clear: jest.fn().mockResolvedValue(undefined) }));
jest.mock("module-alias/register", () => ({}));

describe("worker-kumo", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test("connects storage, clears stale state, and schedules the polling task", async () => {
        require("./worker-kumo");
        await new Promise((resolve) => setImmediate(resolve));

        const { parentPort } = require("worker_threads");
        const mongoDb = require("@core/mongo-db");
        const mongoCollection = require("@core/mongo-collection");
        const mongoCreateIndex = require("@core/mongo-createindex");
        const workerTaskManager = require("@core/worker-taskmanager");
        const routerCache = require("@services/router-cache");

        expect(parentPort.postMessage).toHaveBeenCalledWith({
            restartDelay: 10000,
            restartOn: ["address", "port", "password"],
        });
        expect(mongoDb.connect).toHaveBeenCalledWith("panel-1");
        expect(mongoCollection).toHaveBeenCalledWith("router");
        expect(mongoCreateIndex).toHaveBeenCalledWith(expect.anything(), "timestamp", {
            expireAfterSeconds: 30,
        });
        expect(routerCache.clear).toHaveBeenCalledTimes(1);
        expect(workerTaskManager).toHaveBeenCalledWith(
            expect.objectContaining({
                tasks: [{ name: "router-poll", seconds: 5 }],
                context: {
                    workerData: {
                        id: "panel-1",
                        address: "kumo.local",
                        port: "80",
                        password: "secret",
                    },
                },
                baseDir: expect.any(String),
            })
        );
    });
});

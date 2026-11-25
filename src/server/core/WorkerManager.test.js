jest.mock("fs", () => ({ promises: { readdir: jest.fn() } }));
jest.mock("@core/config-get", () => jest.fn());
jest.mock("@core/logger", () => () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
}));
jest.mock("worker_threads", () => ({
    isMainThread: true,
    SHARE_ENV: Symbol("shared environment"),
    Worker: jest.fn(() => {
        const { EventEmitter } = require("events");
        const worker = new EventEmitter();
        worker.terminate = jest.fn(async () => {
            worker.emit("exit", 0);
            return 0;
        });
        return worker;
    }),
}));

const fs = require("fs").promises;
const { Worker } = require("worker_threads");
const configGet = require("@core/config-get");
const WorkerManager = require("./WorkerManager");

describe("WorkerManager", () => {
    let manager;

    beforeEach(async () => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        fs.readdir.mockResolvedValue(["docker.js", "notes.txt"]);
        configGet.mockResolvedValue({ host: "old", unrelated: "old" });
        const setup = jest.spyOn(WorkerManager.prototype, "setup").mockImplementation(() => {});
        manager = new WorkerManager("/workers", false);
        setup.mockRestore();
        await manager.setup();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test("starts discovered JavaScript workers and tracks their state", () => {
        expect(Worker).toHaveBeenCalledTimes(1);
        expect(Worker).toHaveBeenCalledWith(
            "/workers/docker.js",
            expect.objectContaining({ workerData: { host: "old", unrelated: "old" } })
        );
        expect(manager.workers[0].state).toBe("started");

        manager.workers[0].worker.emit("online");

        expect(manager.workers[0].state).toBe("running");
    });

    test("restarts an exited worker after its configured delay", async () => {
        const originalWorker = manager.workers[0].worker;
        originalWorker.emit("message", { restartDelay: 5000 });
        originalWorker.emit("exit", 1);

        expect(manager.workers[0].state).toBe("stopped");
        await jest.advanceTimersByTimeAsync(4999);
        expect(Worker).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1);
        expect(Worker).toHaveBeenCalledTimes(2);
        expect(manager.workers[0].worker).not.toBe(originalWorker);
    });

    test("restarts only when a configured dependency changes", async () => {
        const originalWorker = manager.workers[0].worker;
        originalWorker.emit("message", { restartOn: ["host"], restartDelay: 5000 });

        await manager.pushConfig({ host: "old", unrelated: "new" });
        expect(originalWorker.terminate).not.toHaveBeenCalled();

        await manager.pushConfig({ host: "new", unrelated: "new" });
        expect(originalWorker.terminate).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(0);

        expect(Worker).toHaveBeenCalledTimes(2);
        expect(Worker).toHaveBeenLastCalledWith(
            "/workers/docker.js",
            expect.objectContaining({ workerData: { host: "new", unrelated: "new" } })
        );
        expect(manager.workers[0].restartDelay).toBe(5000);
    });

    test("does not restart workers after termination", async () => {
        const worker = manager.workers[0].worker;

        await manager.terminateWorkers();
        await jest.advanceTimersByTimeAsync(10000);

        expect(worker.terminate).toHaveBeenCalledTimes(1);
        expect(manager.workers[0].state).toBe("stopped");
        expect(Worker).toHaveBeenCalledTimes(1);
    });

    test("retries relevant worker restarts after a configuration update fails", async () => {
        manager.workers[0].restartKeys = ["host"];
        const restart = jest.spyOn(manager, "restartWorker").mockRejectedValueOnce(new Error("restart failed"));

        await expect(manager.pushConfig({ host: "new" })).rejects.toThrow("restart failed");
        expect(manager.config.host).toBe("old");
        await manager.pushConfig({ host: "new" });

        expect(restart).toHaveBeenCalledTimes(2);
    });

    test("starts an unconfigured module's worker only after configuration", async () => {
        configGet.mockResolvedValue({ needsConfigured: true });
        const setup = jest.spyOn(WorkerManager.prototype, "setup").mockImplementation(() => {});
        const moduleManager = new WorkerManager("/workers", true);
        setup.mockRestore();
        await moduleManager.setup();

        expect(Worker).toHaveBeenCalledTimes(1);
        await moduleManager.pushConfig({ needsConfigured: false, host: "configured" });
        expect(Worker).toHaveBeenCalledTimes(2);
        expect(moduleManager.workers[0].worker).toBeDefined();
    });
});

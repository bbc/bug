const express = require("express");

jest.mock("@models/panel-config", () => ({ get: jest.fn(), set: jest.fn(), list: jest.fn() }));
jest.mock("@models/module-config", () => ({ list: jest.fn() }));
jest.mock("@services/module-get", () => jest.fn());
jest.mock("@utils/key", () => jest.fn());
jest.mock("@utils/docker", () => ({ getContainer: jest.fn() }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), warning: jest.fn(), error: jest.fn() }));

const panels = require("@models/panel-config");
const modules = require("@models/module-config");
const moduleGet = require("@services/module-get");
const docker = require("@utils/docker");

test("saves while unavailable and reconciles the latest config after recovery and restart", async () => {
    let stored = { id: "127.0.0.1", module: "test", enabled: true, key: "key", value: 0 };
    let accepting = false;
    let startedAt = "first";
    const received = [];
    const app = express();
    app.use(express.json());
    app.put("/api/config", (req, res) => {
        received.push(req.body);
        if (!accepting) return res.status(503).json({ status: "error" });
        return res.json({ status: "success", data: true });
    });
    const server = await new Promise((resolve) => {
        const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
    });
    const oldPort = process.env.MODULE_PORT;
    process.env.MODULE_PORT = String(server.address().port);

    try {
        panels.get.mockImplementation(async () => ({ ...stored }));
        panels.set.mockImplementation(async (config) => {
            stored = { ...config };
            return true;
        });
        panels.list.mockImplementation(async () => [{ ...stored }]);
        modules.list.mockResolvedValue([{ name: "test", needsContainer: true }]);
        moduleGet.mockResolvedValue({ needsContainer: true });
        docker.getContainer.mockReturnValue({
            inspect: async () => ({ Id: "container", State: { Running: true, StartedAt: startedAt } }),
        });

        const set = require("./panelconfig-set");
        const { reconcile } = require("./panelconfig-reconcile");
        const delivery = require("./panelconfig-delivery");

        await expect(set({ id: stored.id, value: 1 })).resolves.toEqual({ delivery: "pending" });
        await expect(set({ id: stored.id, value: 2 })).resolves.toEqual({ delivery: "pending" });
        expect(stored.value).toBe(2);

        accepting = true;
        await reconcile();
        expect(received.at(-1).value).toBe(2);
        expect(delivery.get(stored, true)).toBe("accepted");

        await reconcile();
        expect(received).toHaveLength(3);
        startedAt = "second";
        await reconcile();
        expect(received).toHaveLength(4);
        expect(received.at(-1).value).toBe(2);
    } finally {
        if (oldPort === undefined) delete process.env.MODULE_PORT;
        else process.env.MODULE_PORT = oldPort;
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
});

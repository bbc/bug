jest.mock("@models/panel-config", () => ({ list: jest.fn() }));
jest.mock("@models/module-config", () => ({ list: jest.fn() }));
jest.mock("@services/panelconfig-push", () => jest.fn());
jest.mock("@core/logger", () => () => ({ warning: jest.fn(), error: jest.fn() }));

const panels = require("@models/panel-config");
const modules = require("@models/module-config");
const push = require("@services/panelconfig-push");
const { reconcile } = require("./panelconfig-reconcile");
const { start } = require("./panelconfig-reconcile");

test("reconciles enabled container panels and continues when one delivery fails", async () => {
    panels.list.mockResolvedValue([
        { id: "first", module: "network", enabled: true },
        { id: "second", module: "network", enabled: true },
        { id: "disabled", module: "network", enabled: false },
        { id: "no-container", module: "clock", enabled: true },
    ]);
    modules.list.mockResolvedValue([
        { name: "network", needsContainer: true },
        { name: "clock", needsContainer: false },
    ]);
    push.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(true);

    await expect(reconcile()).resolves.toBeUndefined();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith("first", { onlyIfNeeded: true });
    expect(push).toHaveBeenCalledWith("second", { onlyIfNeeded: true });
});

test("continues retrying pending delivery on the reconciliation schedule", async () => {
    jest.useFakeTimers();
    panels.list.mockResolvedValue([{ id: "panel", module: "network", enabled: true }]);
    modules.list.mockResolvedValue([{ name: "network", needsContainer: true }]);
    push.mockReset().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(true);

    try {
        start();
        await jest.advanceTimersByTimeAsync(20000);
        expect(push).toHaveBeenCalledTimes(3);
    } finally {
        jest.clearAllTimers();
        jest.useRealTimers();
    }
});

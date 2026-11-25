jest.mock("@models/panel-config", () => ({ get: jest.fn(), set: jest.fn() }));
jest.mock("@services/panelconfig-push", () => jest.fn());
jest.mock("@services/module-get", () => jest.fn());
jest.mock("@utils/key", () => jest.fn());
jest.mock("@core/logger", () => {
    const logger = { info: jest.fn(), error: jest.fn() };
    return () => logger;
});

const panelConfigModel = require("@models/panel-config");
const panelConfigPush = require("@services/panelconfig-push");
const moduleGet = require("@services/module-get");
const key = require("@utils/key");
const logger = require("@core/logger")(module);
const panelConfigSet = require("./panelconfig-set");

describe("panelconfig-set", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        panelConfigModel.get.mockResolvedValue({
            id: "panel-1",
            module: "clock",
            title: "Old title",
            description: "Existing description",
            key: "existing-key",
            needsConfigured: true,
        });
        panelConfigModel.set.mockResolvedValue(true);
        moduleGet.mockResolvedValue({ needsContainer: false });
        key.mockResolvedValue("generated-key");
        panelConfigPush.mockResolvedValue(true);
    });

    test("merges updates, keeps existing fields and key, and marks the panel configured", async () => {
        await expect(panelConfigSet({ id: "panel-1", title: "New title", needsConfigured: true })).resolves.toBe(true);

        expect(panelConfigModel.get).toHaveBeenCalledWith("panel-1");
        expect(panelConfigModel.set).toHaveBeenCalledWith({
            id: "panel-1",
            module: "clock",
            title: "New title",
            description: "Existing description",
            key: "existing-key",
            needsConfigured: false,
        });
        expect(key).not.toHaveBeenCalled();
        expect(moduleGet).toHaveBeenCalledWith("clock");
        expect(panelConfigPush).not.toHaveBeenCalled();
    });

    test("generates and saves a key when the merged configuration has none", async () => {
        panelConfigModel.get.mockResolvedValue({ id: "panel-1", module: "clock" });

        await expect(panelConfigSet({ id: "panel-1" })).resolves.toBe(true);

        expect(key).toHaveBeenCalledTimes(1);
        expect(panelConfigModel.set).toHaveBeenCalledWith({
            id: "panel-1",
            module: "clock",
            key: "generated-key",
            needsConfigured: false,
        });
    });

    test("pushes the saved configuration when the module needs a container", async () => {
        moduleGet.mockResolvedValue({ needsContainer: true });

        await expect(panelConfigSet({ id: "panel-1", module: "pinger" })).resolves.toBe(true);

        expect(moduleGet).toHaveBeenCalledWith("pinger");
        expect(panelConfigPush).toHaveBeenCalledWith("panel-1");
        expect(panelConfigModel.set.mock.invocationCallOrder[0]).toBeLessThan(
            panelConfigPush.mock.invocationCallOrder[0]
        );
    });

    test.each([undefined, null, {}, { id: "" }])("rejects a missing panel ID: %p", async (config) => {
        await expect(panelConfigSet(config)).rejects.toThrow("Cannot update panel config: Missing panel ID");
        expect(panelConfigModel.get).not.toHaveBeenCalled();
        expect(panelConfigModel.set).not.toHaveBeenCalled();
    });

    test("reports a failed configuration lookup without saving", async () => {
        panelConfigModel.get.mockRejectedValue(new Error("read failed"));

        await expect(panelConfigSet({ id: "panel-1" })).rejects.toThrow("Failed to set panel config for panel-1");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("read failed"));
        expect(panelConfigModel.set).not.toHaveBeenCalled();
    });

    test("reports a failed key generation without saving", async () => {
        panelConfigModel.get.mockResolvedValue({ id: "panel-1", module: "clock" });
        key.mockRejectedValue(new Error("key generation failed"));

        await expect(panelConfigSet({ id: "panel-1" })).rejects.toThrow("Failed to set panel config for panel-1");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("key generation failed"));
        expect(panelConfigModel.set).not.toHaveBeenCalled();
    });

    test.each(["returns false", "throws"])("reports a save failure when the model %s", async (failure) => {
        if (failure === "returns false") {
            panelConfigModel.set.mockResolvedValue(false);
        } else {
            panelConfigModel.set.mockRejectedValue(new Error("write failed"));
        }

        await expect(panelConfigSet({ id: "panel-1" })).rejects.toThrow("Failed to set panel config for panel-1");
        expect(logger.error).toHaveBeenCalled();
        expect(moduleGet).not.toHaveBeenCalled();
        expect(panelConfigPush).not.toHaveBeenCalled();
    });

    test("reports missing module metadata without pushing", async () => {
        moduleGet.mockResolvedValue(null);

        await expect(panelConfigSet({ id: "panel-1" })).rejects.toThrow("Failed to set panel config for panel-1");
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Module metadata not found for: clock"));
        expect(panelConfigPush).not.toHaveBeenCalled();
    });

    test("reports a container push failure after saving", async () => {
        moduleGet.mockResolvedValue({ needsContainer: true });
        panelConfigPush.mockRejectedValue(new Error("push failed"));

        await expect(panelConfigSet({ id: "panel-1" })).rejects.toThrow("Failed to set panel config for panel-1");
        expect(panelConfigModel.set).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("push failed"));
    });
});

jest.mock("@services/panelconfig-list", () => jest.fn());
jest.mock("@core/logger", () => () => ({ warning: jest.fn() }));

const panelConfigList = require("@services/panelconfig-list");
const panelCheckKey = require("./panelconfig-checkkey");

describe("panelconfig-checkkey", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("returns an enabled panel with a matching key", async () => {
        const enabledPanel = { id: "enabled", enabled: true, key: "secret" };
        panelConfigList.mockResolvedValue([{ id: "disabled", enabled: false, key: "secret" }, enabledPanel]);

        await expect(panelCheckKey("secret")).resolves.toEqual(enabledPanel);
    });

    test("rejects disabled panels, absent keys and nonmatching keys", async () => {
        panelConfigList.mockResolvedValue([
            { id: "disabled", enabled: false, key: "secret" },
            { id: "unconfigured", enabled: true },
        ]);

        await expect(panelCheckKey("secret")).resolves.toBeUndefined();
        await expect(panelCheckKey(undefined)).resolves.toBeUndefined();
        await expect(panelCheckKey("other")).resolves.toBeUndefined();
    });

    test("propagates failure to list panel configurations", async () => {
        panelConfigList.mockRejectedValue(new Error("storage unavailable"));

        await expect(panelCheckKey("secret")).rejects.toThrow("Error checking panels for API keys");
    });
});

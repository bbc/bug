const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPutViaCore(...args));

const service = require("./player-update");

describe("player-update", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("merges the update and persists the config", async () => {
        const config = { players: { abc: { title: "One", source: "http://a" } } };
        mockConfigGet.mockResolvedValue(config);
        mockConfigPutViaCore.mockResolvedValue(true);

        await expect(service("abc", { title: "Two" })).resolves.toBe(true);
        expect(config.players.abc).toEqual({ title: "Two", source: "http://a" });
        expect(mockConfigPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(service("abc", { title: "Two" })).rejects.toThrow("Failed to load config");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("throws when the player is not found", async () => {
        mockConfigGet.mockResolvedValue({ players: {} });
        await expect(service("missing", { title: "Two" })).rejects.toThrow("Player missing not found");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service("abc", { title: "Two" })).rejects.toBeDefined();
    });
});

const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPutViaCore(...args));

const service = require("./player-delete");

describe("player-delete", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("removes the player and persists the config", async () => {
        const config = { players: { abc: { title: "One" }, def: { title: "Two" } } };
        mockConfigGet.mockResolvedValue(config);
        mockConfigPutViaCore.mockResolvedValue(true);

        await expect(service("abc")).resolves.toBe(true);
        expect(config.players).toEqual({ def: { title: "Two" } });
        expect(mockConfigPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(service("abc")).rejects.toThrow("Failed to load config");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("throws when the player is not found", async () => {
        mockConfigGet.mockResolvedValue({ players: {} });
        await expect(service("missing")).rejects.toThrow("Player missing not found");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service("abc")).rejects.toBeDefined();
    });
});

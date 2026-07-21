const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPutViaCore(...args));
jest.mock("uuid", () => ({ v4: () => "generated-id" }));

const service = require("./player-add");

describe("player-add", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("adds a trimmed player and persists the config", async () => {
        const config = { players: {} };
        mockConfigGet.mockResolvedValue(config);
        mockConfigPutViaCore.mockResolvedValue(true);

        await expect(service({ title: "  One  ", source: "  http://a  " })).resolves.toBe(true);
        expect(config.players["generated-id"]).toEqual({ title: "One", source: "http://a" });
        expect(mockConfigPutViaCore).toHaveBeenCalledWith(config);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(service({ title: "One", source: "http://a" })).rejects.toThrow("Failed to load config");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("throws when source or title are missing", async () => {
        mockConfigGet.mockResolvedValue({ players: {} });
        await expect(service({ title: "One" })).rejects.toThrow("Player source and title are required");
        expect(mockConfigPutViaCore).not.toHaveBeenCalled();
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service({ title: "One", source: "http://a" })).rejects.toBeDefined();
    });
});

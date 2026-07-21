const mockConfigGet = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));

const service = require("./player-details");

describe("player-details", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns the requested player", async () => {
        const player = { title: "One", source: "http://a" };
        mockConfigGet.mockResolvedValue({ players: { abc: player } });
        await expect(service("abc")).resolves.toEqual(player);
    });

    test("throws when the player is not found", async () => {
        mockConfigGet.mockResolvedValue({ players: {} });
        await expect(service("missing")).rejects.toThrow("Player missing not found");
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service("abc")).rejects.toBeDefined();
    });
});

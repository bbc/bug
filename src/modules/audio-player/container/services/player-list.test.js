const mockConfigGet = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));

const service = require("./player-list");

describe("player-list", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns the players object from config", async () => {
        const players = { abc: { title: "One", source: "http://a" } };
        mockConfigGet.mockResolvedValue({ players });
        await expect(service()).resolves.toEqual(players);
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});

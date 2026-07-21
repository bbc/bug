const mockMongoGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./route-list");

describe("route-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns route values parsed as integers", async () => {
        mockMongoGet.mockResolvedValue({ 0: "3", 1: "5", 2: "0" });
        await expect(service()).resolves.toEqual([3, 5, 0]);
    });

    test("returns an empty array when there are no routes", async () => {
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual([]);
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});

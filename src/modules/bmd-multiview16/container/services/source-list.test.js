const mockMongoGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./source-list");

describe("source-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("returns the label values from the database", async () => {
        mockMongoGet.mockResolvedValue({ 0: "News UK", 1: "News Int'l" });
        await expect(service()).resolves.toEqual(["News UK", "News Int'l"]);
    });

    test("returns an empty array when there are no labels", async () => {
        mockMongoGet.mockResolvedValue(undefined);
        await expect(service()).resolves.toEqual([]);
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});

const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const statusGetSystem = require("./status-getsystem");

describe("status-getsystem", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("returns empty array when system info is missing", async () => {
        mockMongoSingleGet.mockResolvedValue(null);
        await expect(statusGetSystem()).resolves.toEqual([]);
    });

    test("returns default status item when description is missing", async () => {
        mockMongoSingleGet.mockResolvedValue({});
        const result = await statusGetSystem();
        expect(result).toBeDefined();
    });

    test("returns parsed description when model string exists", async () => {
        mockMongoSingleGet.mockResolvedValue({ description: "Cisco IOS Software (C1300-48FP-4X)" });
        const result = await statusGetSystem();
        expect(result).toBeDefined();
    });
});

const mockGet = jest.fn();
const mockStatusItem = jest.fn((value) => value);

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/StatusItem", () => mockStatusItem);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const statusCheckSystem = require("./status-checksystem");

describe("status-checksystem", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockStatusItem.mockClear();
    });

    test("returns critical status when data is stale", async () => {
        mockGet.mockResolvedValue({ lastUpdated: Date.now() - 30000 });

        const result = await statusCheckSystem();
        expect(result).toHaveProperty("key", "systemoutofdate");
        expect(result).toHaveProperty("type", "critical");
    });

    test("returns empty array when data is fresh", async () => {
        mockGet.mockResolvedValue({ lastUpdated: Date.now() });

        await expect(statusCheckSystem()).resolves.toEqual([]);
    });
});

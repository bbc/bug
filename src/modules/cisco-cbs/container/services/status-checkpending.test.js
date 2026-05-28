const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const statusCheckPending = require("./status-checkpending");

describe("status-checkpending", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("returns empty array when pending is false", async () => {
        mockMongoSingleGet.mockResolvedValue(false);
        await expect(statusCheckPending()).resolves.toEqual([]);
    });

    test("returns a status item when pending is true", async () => {
        mockMongoSingleGet.mockResolvedValue(true);
        const result = await statusCheckPending();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
    });
});

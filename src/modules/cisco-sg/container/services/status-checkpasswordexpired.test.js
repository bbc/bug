const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const statusCheckPasswordExpired = require("./status-checkpasswordexpired");

describe("status-checkpasswordexpired", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("returns empty array when password is not expired", async () => {
        mockMongoSingleGet.mockResolvedValue(false);
        await expect(statusCheckPasswordExpired()).resolves.toEqual([]);
    });

    test("returns a status item when password is expired", async () => {
        mockMongoSingleGet.mockResolvedValue(true);
        const result = await statusCheckPasswordExpired();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
    });
});

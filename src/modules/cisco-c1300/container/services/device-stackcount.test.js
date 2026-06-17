const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const deviceStackCount = require("./device-stackcount");

describe("device-stackcount", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("returns null for [null] result", async () => {
        mockMongoCollection.mockResolvedValue({
            distinct: jest.fn(async () => [null]),
        });

        await expect(deviceStackCount()).resolves.toBeNull();
    });

    test("returns distinct device list", async () => {
        mockMongoCollection.mockResolvedValue({
            distinct: jest.fn(async () => [1, 2]),
        });

        await expect(deviceStackCount()).resolves.toEqual([1, 2]);
    });
});

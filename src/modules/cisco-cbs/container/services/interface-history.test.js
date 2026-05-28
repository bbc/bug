const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceHistory = require("./interface-history");

describe("interface-history", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceHistory()).rejects.toThrow("interfaceId is required");
    });

    test("returns mapped datapoints", async () => {
        mockMongoCollection.mockResolvedValue({
            find: jest.fn(() => ({
                toArray: jest.fn(async () => [
                    { timestamp: 1700000000000, interfaces: { "10": { tx: 1, rx: 2 } } },
                    { timestamp: 1700000001000, interfaces: {} },
                ]),
            })),
        });

        const result = await interfaceHistory("10");
        expect(result).toEqual([{ tx: 1, rx: 2, timestamp: 1700000000000 }]);
    });
});

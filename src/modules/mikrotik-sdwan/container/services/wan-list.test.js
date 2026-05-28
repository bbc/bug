const mockGet = jest.fn();
const mockConfigGet = jest.fn();
const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const wanList = require("./wan-list");

describe("wan-list", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
    });

    test("throws when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(wanList()).rejects.toThrow("failed to retrieve system configuration");
    });

    test("returns empty list when routing table prefix is missing", async () => {
        mockConfigGet.mockResolvedValue({});

        await expect(wanList()).resolves.toEqual([]);
    });

    test("returns WAN rows when data is valid", async () => {
        const mockFind = jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([{ bridge: "br1", latest: { "avg-rtt": 10 } }]) }));
        mockMongoCollection.mockResolvedValue({ find: mockFind });
        mockConfigGet.mockResolvedValue({ routingTablePrefix: "rtab-" });
        mockGet
            .mockResolvedValueOnce([{ name: "rtab-1", disabled: false, comment: "wan-a" }])
            .mockResolvedValueOnce([{ "routing-table": "rtab-1", _bridgeName: "br1" }]);

        const result = await wanList();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("pingOk", true);
    });
});

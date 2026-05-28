const mockGet = jest.fn();
const mockMongoCollection = jest.fn();
const mockFreeIpApiLookup = jest.fn();
const mockSrcAddressGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@utils/freeipapi-lookup", () => (...args) => mockFreeIpApiLookup(...args));
jest.mock("@utils/srcaddress-get", () => (...args) => mockSrcAddressGet(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const routeList = require("./route-list");

describe("route-list", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockMongoCollection.mockReset();
        mockFreeIpApiLookup.mockReset();
        mockSrcAddressGet.mockReset();
    });

    test("throws when route data is malformed", async () => {
        const mockFind = jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([]) }));
        mockMongoCollection.mockResolvedValue({ find: mockFind });
        mockGet
            .mockResolvedValueOnce({ bad: true })
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);

        await expect(routeList()).rejects.toThrow("route data is malformed");
    });

    test("returns route list for valid data", async () => {
        const mockFind = jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([]) }));
        mockMongoCollection.mockResolvedValue({ find: mockFind });
        mockGet
            .mockResolvedValueOnce([{ id: "*1", "routing-table": "main", _bridgeName: "br1", distance: 1, dynamic: false }])
            .mockResolvedValueOnce([{ name: "br1", comment: "wan1" }])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        mockSrcAddressGet.mockReturnValue("10.0.0.1");
        mockFreeIpApiLookup.mockResolvedValue(null);

        const result = await routeList();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
    });
});

const mockMongoCollection = jest.fn();
const mockConfigGet = jest.fn();
const mockMongoSingleGet = jest.fn();
const mockMatchAnyRegex = jest.fn(() => false);
const mockExpandVlanRanges = jest.fn((v) => v);

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoSingleGet(...args) }));
jest.mock("@core/regex-matchany", () => (...args) => mockMatchAnyRegex(...args));
jest.mock("@utils/ciscoc1300-expandvlanranges", () => (...args) => mockExpandVlanRanges(...args));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceList = require("./interface-list");

describe("interface-list", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
        mockConfigGet.mockReset();
        mockMongoSingleGet.mockReset();
        mockMatchAnyRegex.mockReset();
        mockExpandVlanRanges.mockReset();
        mockMatchAnyRegex.mockReturnValue(false);
        mockExpandVlanRanges.mockImplementation((v) => v);
    });

    test("rejects when config is missing", async () => {
        mockConfigGet.mockResolvedValue(null);
        await expect(interfaceList()).rejects.toThrow("failed to load config");
    });

    test("returns interfaces with protection metadata", async () => {
        mockConfigGet.mockResolvedValue({ protectedInterfaces: ["Gi1/0/1"] });
        mockMongoCollection.mockResolvedValue({
            find: jest.fn(() => ({ toArray: jest.fn(async () => [{ longId: "Gi1/0/1", description: "u", shortId: "1", device: 1, "tagged-vlans": [] }]) })),
        });
        mockMongoSingleGet.mockResolvedValue([]);

        const result = await interfaceList();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("_protected");
        expect(result[0]).toHaveProperty("_allowunprotect", true);
    });
});

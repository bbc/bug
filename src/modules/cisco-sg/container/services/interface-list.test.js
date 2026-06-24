const mockMongoCollection = jest.fn();
const mockConfigGet = jest.fn();
const mockMatchAnyRegex = jest.fn(() => false);

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/config-get", () => mockConfigGet);
jest.mock("@core/regex-matchany", () => (...args) => mockMatchAnyRegex(...args));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceList = require("./interface-list");

describe("interface-list", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
        mockConfigGet.mockReset();
        mockMatchAnyRegex.mockReset();
        mockMatchAnyRegex.mockReturnValue(false);
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

        const result = await interfaceList();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("_protected");
        expect(result[0]).toHaveProperty("_allowunprotect", true);
    });
});

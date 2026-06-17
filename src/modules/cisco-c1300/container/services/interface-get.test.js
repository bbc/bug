const mockMongoCollection = jest.fn();
const mockMongoSingleGet = jest.fn();
const mockExpandVlanRanges = jest.fn((tagged) => tagged);

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));
jest.mock("@utils/ciscoc1300-expandvlanranges", () => (...args) => mockExpandVlanRanges(...args));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceGet = require("./interface-get");

describe("interface-get exception handling", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
        mockMongoSingleGet.mockReset();
        mockExpandVlanRanges.mockReset();
        mockExpandVlanRanges.mockImplementation((tagged) => tagged);
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceGet()).rejects.toThrow("interfaceId is required");
    });

    test("rejects when vlans are missing or malformed", async () => {
        mockMongoSingleGet.mockResolvedValue(null);

        await expect(interfaceGet(10)).rejects.toThrow("vlans data is missing or malformed");
    });

    test("rejects when interface does not exist", async () => {
        mockMongoSingleGet.mockResolvedValue([{ id: 1 }]);
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => null),
        });

        await expect(interfaceGet(10)).rejects.toThrow("interface 10 not found");
    });

    test("returns interface with expanded VLAN ranges", async () => {
        mockMongoSingleGet.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => ({ interfaceId: 10, "tagged-vlans": ["1-2"] })),
        });
        mockExpandVlanRanges.mockReturnValue([1, 2]);

        await expect(interfaceGet(10)).resolves.toEqual({ interfaceId: 10, "tagged-vlans": [1, 2] });
    });
});

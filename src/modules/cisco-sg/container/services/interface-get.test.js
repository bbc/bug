const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceGet = require("./interface-get");

describe("interface-get exception handling", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceGet()).rejects.toThrow("interfaceId is required");
    });

    test("rejects when interface does not exist", async () => {
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => null),
        });

        await expect(interfaceGet(10)).rejects.toThrow("interface 10 not found");
    });

    test("returns interface object", async () => {
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => ({ interfaceId: 10, "tagged-vlans": ["1-2"] })),
        });

        await expect(interfaceGet(10)).resolves.toEqual({ interfaceId: 10, "tagged-vlans": ["1-2"] });
    });
});

const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => mockMongoCollection);
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const interfaceGetFdb = require("./interface-getfdb");

describe("interface-getfdb", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("rejects when interfaceId is missing", async () => {
        await expect(interfaceGetFdb(null, "asc", {}, null)).rejects.toThrow("interfaceId is required");
    });

    test("returns empty array when interface has no fdb", async () => {
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => ({ interfaceId: 10 })),
        });

        await expect(interfaceGetFdb(null, "asc", {}, 10)).resolves.toEqual([]);
    });

    test("filters by mac", async () => {
        mockMongoCollection.mockResolvedValue({
            findOne: jest.fn(async () => ({
                interfaceId: 10,
                fdb: [{ mac: "aa:bb", address: "1.1.1.1" }, { mac: "cc:dd", address: "2.2.2.2" }],
            })),
        });

        const result = await interfaceGetFdb(null, "asc", { mac: "aa" }, 10);
        expect(result).toEqual([{ mac: "aa:bb", address: "1.1.1.1" }]);
    });
});

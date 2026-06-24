const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));
jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const vlanList = require("./vlan-list");

describe("vlan-list", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("returns vlan list", async () => {
        mockMongoSingleGet.mockResolvedValue([{ id: 1 }]);
        await expect(vlanList()).resolves.toEqual([{ id: 1 }]);
    });

    test("rejects when mongo getter throws synchronously", async () => {
        mockMongoSingleGet.mockImplementation(() => {
            throw new Error("vlan read failed");
        });
        await expect(vlanList()).rejects.toThrow("vlan read failed");
    });
});

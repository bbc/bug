const mockMongoGet = jest.fn();
jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));

const service = require("./vlan-list");

describe("vlan-list", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockImplementation(() => { throw new Error("boom"); });
        await expect(service()).rejects.toBeDefined();
    });
});

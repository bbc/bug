const mockMongoGet = jest.fn();
jest.mock("@core/mongo-single", () => ({ get: (...args) => mockMongoGet(...args) }));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@core/StatusItem", () => function StatusItem(value) { return value; });

const service = require("./status-checkinterfacestatus");

describe("status-checkinterfacestatus", () => {
    beforeEach(() => {
        mockMongoGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockMongoGet.mockImplementation(() => { throw new Error("boom"); });
        await expect(service()).resolves.toBeDefined();
    });
});

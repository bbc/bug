const mockConfigGet = jest.fn();
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn(), warning: jest.fn() }));
jest.mock("@services/device-setpending", () => jest.fn(async () => true));
jest.mock("@utils/arista-api", () => jest.fn(async () => true));
jest.mock("@core/mongo-collection", () => (...args) => ({ find: () => ({ toArray: async () => [] }), findOne: async () => ({}), updateOne: async () => ({ matchedCount: 1, result: {} }) }));
jest.mock("@core/mongo-single", () => ({ get: async () => ({ protectedInterfaces: [] }) }));
jest.mock("@core/config-putviacore", () => jest.fn(async () => true));
jest.mock("@core/sort-handlers", () => ({ number: () => 0, string: () => 0, ipAddress: () => 0 }));
jest.mock("@core/regex-matchany", () => () => true);
jest.mock("@utils/arista-expandvlanranges", () => () => ([]));

const service = require("./interface-setvlanaccess");

describe("interface-setvlanaccess", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
    });

    test("exports a function", () => {
        expect(typeof service).toBe("function");
    });

    test("handles dependency exceptions", async () => {
        mockConfigGet.mockRejectedValue(new Error("boom"));
        await expect(service()).rejects.toBeDefined();
    });
});

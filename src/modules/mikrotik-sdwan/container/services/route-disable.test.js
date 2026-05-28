const mockGet = jest.fn();
const mockSet = jest.fn();
const mockMongoCollection = jest.fn();
const mockSrcAddressGet = jest.fn();
const mockConfigGet = jest.fn();
const mockRun = jest.fn();
const mockRouterOSApi = jest.fn().mockImplementation(() => ({
    run: (...args) => mockRun(...args),
}));

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
    set: (...args) => mockSet(...args),
}));
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@utils/srcaddress-get", () => (...args) => mockSrcAddressGet(...args));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/routeros-api", () => mockRouterOSApi);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const routeDisable = require("./route-disable");

describe("route-disable", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockMongoCollection.mockReset();
        mockSrcAddressGet.mockReset();
        mockConfigGet.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(routeDisable("*1")).rejects.toThrow("failed to load config");
    });

    test("throws when route is dynamic", async () => {
        const mockDeleteMany = jest.fn();

        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockMongoCollection.mockResolvedValue({ deleteMany: mockDeleteMany });
        mockGet
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ id: "*1", dynamic: true }]);

        await expect(routeDisable("*1")).rejects.toThrow("cannot disable dynamic route");
    });
});

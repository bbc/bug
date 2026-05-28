const mockGet = jest.fn();
const mockSet = jest.fn();
const mockConfigGet = jest.fn();
const mockRun = jest.fn();
const mockRouterOSApi = jest.fn().mockImplementation(() => ({
    run: (...args) => mockRun(...args),
}));

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
    set: (...args) => mockSet(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/routeros-api", () => mockRouterOSApi);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const routeRename = require("./route-rename");

describe("route-rename", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockConfigGet.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(routeRename("*1", "wan-a")).rejects.toThrow("failed to load config");
    });

    test("renames static route", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet
            .mockResolvedValueOnce([{ id: "*1", dynamic: false, comment: "old" }])
            .mockResolvedValueOnce([]);
        mockRun.mockResolvedValue(true);
        mockSet.mockResolvedValue(true);

        await expect(routeRename("*1", "wan-a")).resolves.toBe(true);
    });
});

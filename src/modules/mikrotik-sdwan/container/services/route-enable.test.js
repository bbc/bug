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

const routeEnable = require("./route-enable");

describe("route-enable", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockConfigGet.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(routeEnable("*1")).rejects.toThrow("failed to load config");
    });

    test("enables a static route", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet.mockResolvedValue([{ id: "*1", dynamic: false, disabled: true }]);
        mockRun.mockResolvedValue(true);
        mockSet.mockResolvedValue(true);

        await expect(routeEnable("*1")).resolves.toBe(true);
    });
});

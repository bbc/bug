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

const entrySetRoute = require("./entry-setroute");

describe("entry-setroute", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockConfigGet.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when address is missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });

        await expect(entrySetRoute()).rejects.toThrow("no address provided to set route");
    });

    test("updates route list for existing managed entry", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet.mockResolvedValue([{ id: "*1", address: "10.0.0.10", isManaged: true, list: "none" }]);
        mockRun.mockResolvedValue(true);
        mockSet.mockResolvedValue(true);

        await expect(entrySetRoute("10.0.0.10", "rtab-1")).resolves.toBe(true);
    });
});

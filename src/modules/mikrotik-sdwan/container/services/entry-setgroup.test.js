const mockGet = jest.fn();
const mockSet = jest.fn();
const mockConfigGet = jest.fn();
const mockStringify = jest.fn();
const mockRun = jest.fn();
const mockRouterOSApi = jest.fn().mockImplementation(() => ({
    run: (...args) => mockRun(...args),
}));

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
    set: (...args) => mockSet(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@utils/comment-parser", () => ({
    stringify: (...args) => mockStringify(...args),
}));
jest.mock("@core/routeros-api", () => mockRouterOSApi);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const entrySetGroup = require("./entry-setgroup");

describe("entry-setgroup", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockConfigGet.mockReset();
        mockStringify.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws when address is missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });

        await expect(entrySetGroup(undefined, "office")).rejects.toThrow("no address provided to set group");
    });

    test("updates group for managed entry", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet.mockResolvedValue([{ id: "*1", address: "10.0.0.10", isManaged: true, comment: "old" }]);
        mockStringify.mockReturnValue("[bug_sdwan] group=office");
        mockRun.mockResolvedValue(true);
        mockSet.mockResolvedValue(true);

        await expect(entrySetGroup("10.0.0.10", "office")).resolves.toBe(true);
    });
});

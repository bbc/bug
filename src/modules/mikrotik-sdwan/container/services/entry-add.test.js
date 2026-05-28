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

const entryAdd = require("./entry-add");

describe("entry-add", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockSet.mockReset();
        mockConfigGet.mockReset();
        mockStringify.mockReset();
        mockRun.mockReset();
        mockRouterOSApi.mockClear();
    });

    test("throws for missing entry data", async () => {
        await expect(entryAdd()).rejects.toThrow("missing required entry data");
    });

    test("adds entry when valid data is provided", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet.mockResolvedValue([]);
        mockStringify.mockReturnValue("[bug_sdwan] new");
        mockRun.mockResolvedValue([]);
        mockSet.mockResolvedValue(true);

        await expect(entryAdd({ address: "10.0.0.10", label: "new" })).resolves.toBe(true);
    });
});

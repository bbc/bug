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

const entrySetLabel = require("./entry-setlabel");

describe("entry-setlabel", () => {
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

        await expect(entrySetLabel(undefined, "new")).rejects.toThrow("no address provided to set label");
    });

    test("updates label for managed entry", async () => {
        mockConfigGet.mockResolvedValue({ address: "1.1.1.1", username: "u", password: "p" });
        mockGet.mockResolvedValue([{ id: "*1", address: "10.0.0.10", isManaged: true, comment: "old" }]);
        mockStringify.mockReturnValue("[bug_sdwan] label=new");
        mockRun.mockResolvedValue(true);
        mockSet.mockResolvedValue(true);

        await expect(entrySetLabel("10.0.0.10", "new")).resolves.toBe(true);
    });
});

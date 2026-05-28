const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPutViaCore(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const entryUnlock = require("./entry-unlock");

describe("entry-unlock", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("throws when address is missing", async () => {
        await expect(entryUnlock()).rejects.toThrow("no address provided for entry unlock");
    });

    test("returns true when entry is already unlocked", async () => {
        mockConfigGet.mockResolvedValue({ lockedEntries: [] });

        await expect(entryUnlock("10.0.0.10")).resolves.toBe(true);
    });
});

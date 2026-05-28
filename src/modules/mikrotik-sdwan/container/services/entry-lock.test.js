const mockConfigGet = jest.fn();
const mockConfigPutViaCore = jest.fn();

jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/config-putviacore", () => (...args) => mockConfigPutViaCore(...args));
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const entryLock = require("./entry-lock");

describe("entry-lock", () => {
    beforeEach(() => {
        mockConfigGet.mockReset();
        mockConfigPutViaCore.mockReset();
    });

    test("throws when address is missing", async () => {
        await expect(entryLock()).rejects.toThrow("no address provided to lock entry");
    });

    test("locks a valid entry", async () => {
        mockConfigGet.mockResolvedValue({ lockedEntries: [] });
        mockConfigPutViaCore.mockResolvedValue(true);

        await expect(entryLock("10.0.0.10")).resolves.toBe(true);
    });
});

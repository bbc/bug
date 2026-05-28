const mockGet = jest.fn();
const mockConfigGet = jest.fn();
const mockStatusItem = jest.fn((value) => value);

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockGet(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/StatusItem", () => mockStatusItem);
jest.mock("@core/logger", () => () => ({ error: jest.fn(), info: jest.fn() }));

const statusCheckEntries = require("./status-checkentries");

describe("status-checkentries", () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockConfigGet.mockReset();
        mockStatusItem.mockClear();
    });

    test("returns empty array when config is missing", async () => {
        mockGet.mockResolvedValue([]);
        mockConfigGet.mockResolvedValue(null);

        await expect(statusCheckEntries()).resolves.toEqual([]);
    });

    test("returns default status item for valid inputs", async () => {
        mockGet
            .mockResolvedValueOnce([{ name: "rtab-1", disabled: false, comment: "wan" }])
            .mockResolvedValueOnce([{ isManaged: true }]);
        mockConfigGet.mockResolvedValue({ routingTablePrefix: "rtab-" });

        const result = await statusCheckEntries();
        expect(result).toHaveProperty("key", "defaultservice");
        expect(result).toHaveProperty("type", "default");
    });
});

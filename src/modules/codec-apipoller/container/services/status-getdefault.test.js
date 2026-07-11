const mockMongoSingleGet = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

jest.mock(
    "javascript-time-ago",
    () => {
        function MockTimeAgo() { }
        MockTimeAgo.addDefaultLocale = jest.fn();
        MockTimeAgo.prototype.format = jest.fn(() => "2 minutes ago");
        return MockTimeAgo;
    },
    { virtual: true }
);

jest.mock("javascript-time-ago/locale/en.json", () => ({}), { virtual: true });

const service = require("./status-getdefault");

describe("status-getdefault", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns a default status item with codec count and relative update time", async () => {
        mockMongoSingleGet.mockImplementation(async (key) => {
            if (key === "codecs") {
                return [{ id: 1 }, { id: 2 }, { id: 3 }];
            }

            if (key === "codecsStatus") {
                return { lastUpdated: "2026-07-11T12:00:00.000Z" };
            }

            return null;
        });

        const result = await service();

        expect(mockMongoSingleGet).toHaveBeenCalledWith("codecs");
        expect(mockMongoSingleGet).toHaveBeenCalledWith("codecsStatus");
        expect(result).toHaveProperty("key", "defaultservice");
        expect(result).toHaveProperty("type", "default");
        expect(result.message).toBe("Module active with 3 codec record(s), updated 2 minutes ago");
    });

    test("returns never when no status timestamp exists", async () => {
        mockMongoSingleGet.mockImplementation(async (key) => {
            if (key === "codecs") {
                return [{ id: 1 }];
            }

            if (key === "codecsStatus") {
                return null;
            }

            return null;
        });

        const result = await service();

        expect(result.message).toBe("Module active with 1 codec record(s), updated never");
    });

    test("returns empty array when data lookup fails", async () => {
        mockMongoSingleGet.mockRejectedValue(new Error("boom"));

        const result = await service();

        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
    });
});
const mockMongoSingleGet = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

const service = require("./codec-get");

describe("codec-get", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns a matching codec by id", async () => {
        const codec = { id: "codec-2", name: "Codec 2" };
        mockMongoSingleGet.mockResolvedValue([{ id: "codec-1" }, codec]);

        const result = await service("codec-2");

        expect(result).toEqual(codec);
    });

    test("rejects when codecId is missing", async () => {
        await expect(service()).rejects.toThrow("codecId is required");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("rejects when codec is not found", async () => {
        mockMongoSingleGet.mockResolvedValue([{ id: "codec-1" }]);

        await expect(service("codec-2")).rejects.toThrow("codec codec-2 not found");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});

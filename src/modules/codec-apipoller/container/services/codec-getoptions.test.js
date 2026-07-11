const mockMongoSingleGet = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

const service = require("./codec-getoptions");

describe("codec-getoptions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns sorted unique values for nested and array fields", async () => {
        mockMongoSingleGet.mockResolvedValue([
            { zone: "zulu", device: { tags: ["decoder", "dr"] } },
            { zone: "alpha", device: { tags: ["decoder", "encoder"] } },
            { zone: "alpha", device: { tags: [] } },
        ]);

        await expect(service("zone")).resolves.toEqual(["alpha", "zulu"]);
        await expect(service("device.tags")).resolves.toEqual(["decoder", "dr", "encoder"]);
    });

    test("returns empty list when fieldName is not provided", async () => {
        mockMongoSingleGet.mockResolvedValue([{ zone: "alpha" }]);

        const result = await service();

        expect(result).toEqual([]);
    });

    test("logs and rethrows lookup failures", async () => {
        mockMongoSingleGet.mockRejectedValue(new Error("boom"));

        await expect(service("zone")).rejects.toThrow("boom");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});

const mockMongoSingleGet = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
}));

const service = require("./capability-codecdb");

describe("capability-codecdb", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns codec data from mongo-single", async () => {
        const codecs = [{ id: "codec-1" }];
        mockMongoSingleGet.mockResolvedValue(codecs);

        const result = await service();

        expect(mockMongoSingleGet).toHaveBeenCalledWith("codecs");
        expect(result).toEqual(codecs);
    });

    test("logs and rethrows lookup failures", async () => {
        const error = new Error("boom");
        mockMongoSingleGet.mockRejectedValue(error);

        await expect(service()).rejects.toThrow("boom");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});

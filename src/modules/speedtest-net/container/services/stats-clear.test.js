const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const clearStats = require("./stats-clear");

describe("stats-clear service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("clears both graph stat collections", async () => {
        const downloadDeleteMany = jest.fn().mockResolvedValue({ deletedCount: 3 });
        const uploadDeleteMany = jest.fn().mockResolvedValue({ deletedCount: 4 });

        mockMongoCollection
            .mockResolvedValueOnce({ deleteMany: downloadDeleteMany })
            .mockResolvedValueOnce({ deleteMany: uploadDeleteMany });

        const result = await clearStats();

        expect(mockMongoCollection).toHaveBeenNthCalledWith(1, "download-stats");
        expect(mockMongoCollection).toHaveBeenNthCalledWith(2, "upload-stats");
        expect(downloadDeleteMany).toHaveBeenCalledWith({});
        expect(uploadDeleteMany).toHaveBeenCalledWith({});
        expect(result).toEqual({
            data: {
                downloadDeletedCount: 3,
                uploadDeletedCount: 4,
            },
        });
    });

    test("returns error when collection access fails", async () => {
        const error = new Error("db down");
        mockMongoCollection.mockRejectedValue(error);

        const result = await clearStats();

        expect(result).toEqual({ error });
    });
});
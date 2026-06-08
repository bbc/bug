const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const uploadStats = require("./upload-stats");

describe("upload-stats service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns upload stats from collection", async () => {
        const toArray = jest.fn().mockResolvedValue([{ speed: 456 }]);
        const find = jest.fn(() => ({ toArray }));
        mockMongoCollection.mockResolvedValue({ find });

        const result = await uploadStats();

        expect(mockMongoCollection).toHaveBeenCalledWith("upload-stats");
        expect(result).toEqual([{ speed: 456 }]);
    });

    test("returns empty array when collection access fails", async () => {
        mockMongoCollection.mockRejectedValue(new Error("db down"));

        const result = await uploadStats();

        expect(result).toEqual([]);
    });
});

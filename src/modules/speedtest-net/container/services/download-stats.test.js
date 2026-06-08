const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const downloadStats = require("./download-stats");

describe("download-stats service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns download stats from collection", async () => {
        const toArray = jest.fn().mockResolvedValue([{ speed: 123 }]);
        const find = jest.fn(() => ({ toArray }));
        mockMongoCollection.mockResolvedValue({ find });

        const result = await downloadStats();

        expect(mockMongoCollection).toHaveBeenCalledWith("download-stats");
        expect(result).toEqual([{ speed: 123 }]);
    });

    test("returns empty array when collection access fails", async () => {
        mockMongoCollection.mockRejectedValue(new Error("db down"));

        const result = await downloadStats();

        expect(result).toEqual([]);
    });
});

const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const service = require("./status-getdefault");

describe("status-getdefault", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns most recent upload/download summary when latest result has both", async () => {
        const findOne = jest.fn().mockResolvedValue({
            download: { bandwidth: 12000000 },
            upload: { bandwidth: 8000000 },
        });
        const countDocuments = jest.fn().mockResolvedValue(3);
        mockMongoCollection.mockResolvedValue({ findOne, countDocuments });

        const result = await service();

        expect(result).toHaveProperty("key", "defaultservice");
        expect(result).toHaveProperty("type", "default");
        expect(result.message).toBe("Most recent test: download 120Mb/s, upload 80Mb/s");
    });

    test("returns result count summary when latest has no upload/download", async () => {
        const findOne = jest.fn().mockResolvedValue({ error: "failed" });
        const countDocuments = jest.fn().mockResolvedValue(4);
        mockMongoCollection.mockResolvedValue({ findOne, countDocuments });

        const result = await service();

        expect(result.message).toBe("4 test result(s) found");
    });

    test("returns configured message when there are no results", async () => {
        const findOne = jest.fn().mockResolvedValue(null);
        const countDocuments = jest.fn().mockResolvedValue(0);
        mockMongoCollection.mockResolvedValue({ findOne, countDocuments });

        const result = await service();

        expect(result.message).toBe("Panel configured and ready");
    });
});

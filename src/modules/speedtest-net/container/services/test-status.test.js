const mockMongoCollection = jest.fn();

jest.mock("../utils/speedtest", () => jest.fn());
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const testStatus = require("./test-status");

describe("test-status service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns latest test result", async () => {
        const findOne = jest.fn().mockResolvedValue({ running: false });
        mockMongoCollection.mockResolvedValue({ findOne });

        const result = await testStatus();

        expect(mockMongoCollection).toHaveBeenCalledWith("test-results");
        expect(findOne).toHaveBeenCalledWith({}, { sort: { timestamp: -1 } });
        expect(result).toEqual({ data: { running: false } });
    });

    test("returns error when database lookup fails", async () => {
        const error = new Error("db down");
        mockMongoCollection.mockRejectedValue(error);

        const result = await testStatus();

        expect(result).toEqual({ error });
    });
});

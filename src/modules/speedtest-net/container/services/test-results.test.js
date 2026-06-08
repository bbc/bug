const mockMongoCollection = jest.fn();

jest.mock("../utils/speedtest", () => jest.fn());
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const testResults = require("./test-results");

describe("test-results service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns result list limited by parsed value", async () => {
        const toArray = jest.fn().mockResolvedValue([{ id: 1 }]);
        const limit = jest.fn(() => ({ toArray }));
        const find = jest.fn(() => ({ limit }));
        mockMongoCollection.mockResolvedValue({ find });

        const result = await testResults("7");

        expect(mockMongoCollection).toHaveBeenCalledWith("test-results");
        expect(find).toHaveBeenCalledWith({}, { sort: { timestamp: -1 } });
        expect(limit).toHaveBeenCalledWith(7);
        expect(result).toEqual({ data: [{ id: 1 }] });
    });

    test("returns error when query fails", async () => {
        const error = new Error("db down");
        mockMongoCollection.mockRejectedValue(error);

        const result = await testResults();

        expect(result).toEqual({ error });
    });
});

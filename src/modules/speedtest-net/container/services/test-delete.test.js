const mockMongoCollection = jest.fn();
const mockObjectId = jest.fn();

jest.mock("../utils/speedtest", () => jest.fn());
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("mongodb", () => ({ ObjectID: (...args) => mockObjectId(...args) }));

const testDelete = require("./test-delete");

describe("test-delete service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("deletes entry by object id", async () => {
        const deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
        mockMongoCollection.mockResolvedValue({ deleteOne });
        mockObjectId.mockReturnValue("oid-123");

        const result = await testDelete("abc123");

        expect(mockMongoCollection).toHaveBeenCalledWith("test-results");
        expect(mockObjectId).toHaveBeenCalledWith("abc123");
        expect(deleteOne).toHaveBeenCalledWith({ _id: "oid-123" });
        expect(result).toEqual({ data: { deletedCount: 1 } });
    });

    test("returns error when delete fails", async () => {
        const error = new Error("delete failed");
        mockMongoCollection.mockRejectedValue(error);

        const result = await testDelete("abc123");

        expect(result).toEqual({ error });
    });
});

const mockMongoSingleGet = jest.fn();

jest.mock("@core/mongo-single", () => ({
    get: (...args) => mockMongoSingleGet(...args),
}));

jest.mock("@core/logger", () => () => ({ info: jest.fn(), error: jest.fn() }));

const pendingGet = require("./pending-get");

describe("pending-get exception handling", () => {
    beforeEach(() => {
        mockMongoSingleGet.mockReset();
    });

    test("rejects when mongo get throws", async () => {
        mockMongoSingleGet.mockRejectedValue(new Error("mongo exploded"));

        await expect(pendingGet()).rejects.toThrow("mongo exploded");
    });

    test("returns pending value when mongo succeeds", async () => {
        mockMongoSingleGet.mockResolvedValue(true);

        await expect(pendingGet()).resolves.toBe(true);
    });
});

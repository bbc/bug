const mockMongoCollection = jest.fn();
const mockLoggerError = jest.fn();
const mockStatusItem = jest.fn((payload) => payload);

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@core/StatusItem", () => function StatusItem(payload) {
    return mockStatusItem(payload);
});
jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
    info: jest.fn(),
    warning: jest.fn(),
}));

const service = require("./status-getdefault");

describe("status-getdefault", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
        mockLoggerError.mockReset();
        mockStatusItem.mockClear();
    });

    test("returns default status summary", async () => {
        const mockDevicesCollection = {
            find: jest.fn(() => ({ toArray: jest.fn(async () => ([{ name: "a" }, { name: "b" }])) })),
        };
        mockMongoCollection.mockResolvedValue(mockDevicesCollection);

        const result = await service();

        expect(mockMongoCollection).toHaveBeenCalledWith("devices");
        expect(result).toHaveProperty("key", "defaultservice");
        expect(result).toHaveProperty("type", "default");
        expect(result).toHaveProperty("message", "Controller connected with 2 active device(s)");
    });

    test("returns empty array when dependency fails", async () => {
        mockMongoCollection.mockRejectedValue(new Error("boom"));

        const result = await service();

        expect(mockLoggerError).toHaveBeenCalled();
        expect(result).toEqual([]);
    });
});

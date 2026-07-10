const mockCommand = jest.fn();
const mockConfigGet = jest.fn();
const mockMongoCollection = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("@utils/turtle-webapi", () => ({
    command: (...args) => mockCommand(...args),
}));
jest.mock("@core/config-get", () => (...args) => mockConfigGet(...args));
jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));
jest.mock("@core/logger", () => () => ({
    error: (...args) => mockLoggerError(...args),
    info: jest.fn(),
}));

const service = require("./button-clearlabel");

describe("button-clearlabel", () => {
    beforeEach(() => {
        mockCommand.mockReset();
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
        mockLoggerError.mockReset();
    });

    test("clears label to index string for small button counts", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ labels: new Array(5).fill(null) })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        const result = await service("source", "dev-a", 3);

        expect(result).toBe(true);
        expect(mockCommand).toHaveBeenCalledWith("10.0.0.1", [
            "SET", "DANTE", "DEV", "dev-a", "AUDIO", "TXCHN", 3, "NAME", "3",
        ]);
        expect(buttonCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "dev-a", "labels.index": 3 },
            expect.objectContaining({
                $set: expect.objectContaining({
                    "labels.$.name": "3",
                    skipNextWorkerUpdate: true,
                }),
            })
        );
    });

    test("pads label to 2 digits when button count is greater than 9", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ labels: new Array(10).fill(null) })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        const result = await service("destination", "dev-b", 5);

        expect(result).toBe(true);
        expect(mockCommand).toHaveBeenCalledWith("10.0.0.1", [
            "SET", "DANTE", "DEV", "dev-b", "AUDIO", "RXCHN", 5, "NAME", "05",
        ]);
        expect(buttonCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "dev-b", "labels.index": 5 },
            expect.objectContaining({
                $set: expect.objectContaining({ "labels.$.name": "05" }),
            })
        );
    });

    test("pads label to 3 digits when button count is greater than 99", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ labels: new Array(100).fill(null) })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        const result = await service("source", "dev-c", 7);

        expect(result).toBe(true);
        expect(mockCommand).toHaveBeenCalledWith("10.0.0.1", [
            "SET", "DANTE", "DEV", "dev-c", "AUDIO", "TXCHN", 7, "NAME", "007",
        ]);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(service("source", "dev-a", 1)).rejects.toThrow("failed to fetch config");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when button document is missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });

        const buttonCollection = {
            findOne: jest.fn(async () => null),
            updateOne: jest.fn(),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await expect(service("source", "dev-a", 1)).rejects.toThrow("missing source document for source clear label");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when turtle web API command fails", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockRejectedValue(new Error("connection refused"));

        const buttonCollection = {
            findOne: jest.fn(async () => ({ labels: new Array(5).fill(null) })),
            updateOne: jest.fn(),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await expect(service("source", "dev-a", 1)).rejects.toThrow("failed to clear label for source");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when update target is not found", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ labels: new Array(5).fill(null) })),
            updateOne: jest.fn(async () => ({ matchedCount: 0 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await expect(service("source", "dev-a", 1)).rejects.toThrow("source clear label target not found");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});

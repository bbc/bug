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

const service = require("./button-rename");

describe("button-rename", () => {
    beforeEach(() => {
        mockCommand.mockReset();
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
        mockLoggerError.mockReset();
    });

    test("renames source button and persists new name", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dev-a", labels: [] })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        const result = await service("source", "dev-a", 2, "My Source");

        expect(result).toBe(true);
        expect(mockCommand).toHaveBeenCalledWith("10.0.0.1", [
            "SET", "DANTE", "DEV", "dev-a", "AUDIO", "TXCHN", 2, "NAME", "My Source",
        ]);
        expect(buttonCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "dev-a", "labels.index": 2 },
            expect.objectContaining({
                $set: expect.objectContaining({ "labels.$.name": "My Source" }),
            })
        );
    });

    test("sends RXCHN command for destination button type", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dev-b", labels: [] })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await service("destination", "dev-b", 4, "My Dest");

        expect(mockCommand).toHaveBeenCalledWith("10.0.0.1", [
            "SET", "DANTE", "DEV", "dev-b", "AUDIO", "RXCHN", 4, "NAME", "My Dest",
        ]);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(service("source", "dev-a", 1, "New Name")).rejects.toThrow("failed to fetch config");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when turtle web API command fails", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockRejectedValue(new Error("timeout"));

        await expect(service("source", "dev-a", 1, "New Name")).rejects.toThrow("failed to rename source");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when button document is missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => null),
            updateOne: jest.fn(),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await expect(service("source", "dev-a", 1, "New Name")).rejects.toThrow("missing source document for source rename");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });

    test("throws when update target is not found", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.1" });
        mockCommand.mockResolvedValue(undefined);

        const buttonCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dev-a", labels: [] })),
            updateOne: jest.fn(async () => ({ matchedCount: 0 })),
        };
        mockMongoCollection.mockResolvedValue(buttonCollection);

        await expect(service("source", "dev-a", 1, "New Name")).rejects.toThrow("source rename target not found");
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
    });
});

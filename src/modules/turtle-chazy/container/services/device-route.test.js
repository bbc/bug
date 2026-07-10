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
    warning: jest.fn(),
    debug: jest.fn(),
}));

const service = require("./device-route");

describe("device-route", () => {
    beforeEach(() => {
        mockCommand.mockReset();
        mockConfigGet.mockReset();
        mockMongoCollection.mockReset();
        mockLoggerError.mockReset();
    });

    test("applies route and updates persisted route entry", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.20" });
        mockCommand.mockResolvedValue(undefined);

        const routesCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dest-a", routes: [{ destinationIndex: 1 }] })),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        const sourcesCollection = {
            findOne: jest.fn(async () => ({ deviceId: "src-a", labels: [{ name: "Input 1" }, { name: "Input 2" }] })),
        };
        const destinationsCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dest-a", labels: [{ name: "Output 1" }] })),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "routes") return routesCollection;
            if (name === "sources") return sourcesCollection;
            if (name === "destinations") return destinationsCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        const result = await service("dest-a", 1, "src-a", 2);

        expect(mockCommand).toHaveBeenCalledWith("10.0.0.20", [
            "SET", "DANTE", "DEV", "dest-a", "AUDIO", "RXCHN", 1, "SOURCE", "src-a", "CHN", 2,
        ]);
        expect(routesCollection.updateOne).toHaveBeenCalledWith(
            { deviceId: "dest-a", "routes.destinationIndex": 1 },
            {
                $set: {
                    "routes.$": {
                        destinationChannel: "Output 1",
                        destinationIndex: 1,
                        sourceDevice: "src-a",
                        sourceChannel: "Input 2",
                        sourceIndex: 2,
                    },
                },
            }
        );
        expect(result).toBe(true);
    });

    test("throws when config cannot be loaded", async () => {
        mockConfigGet.mockResolvedValue(null);

        await expect(service("dest-a", 1, "src-a", 1)).rejects.toThrow("failed to fetch config");
    });

    test("throws when device command fails", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.20" });
        mockCommand.mockRejectedValue(new Error("timeout"));

        await expect(service("dest-a", 1, "src-a", 1)).rejects.toThrow("failed to apply route command");
    });

    test("throws when required route documents are missing", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.20" });
        mockCommand.mockResolvedValue(undefined);

        const routesCollection = {
            findOne: jest.fn(async () => null),
            updateOne: jest.fn(async () => ({ matchedCount: 1 })),
        };
        const sourcesCollection = {
            findOne: jest.fn(async () => ({ deviceId: "src-a", labels: [{ name: "Input 1" }] })),
        };
        const destinationsCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dest-a", labels: [{ name: "Output 1" }] })),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "routes") return routesCollection;
            if (name === "sources") return sourcesCollection;
            if (name === "destinations") return destinationsCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        await expect(service("dest-a", 1, "src-a", 1)).rejects.toThrow("missing source, destination, or route document for route update");
    });

    test("throws when route update target is not found", async () => {
        mockConfigGet.mockResolvedValue({ address: "10.0.0.20" });
        mockCommand.mockResolvedValue(undefined);

        const routesCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dest-a", routes: [{ destinationIndex: 1 }] })),
            updateOne: jest.fn(async () => ({ matchedCount: 0 })),
        };
        const sourcesCollection = {
            findOne: jest.fn(async () => ({ deviceId: "src-a", labels: [{ name: "Input 1" }] })),
        };
        const destinationsCollection = {
            findOne: jest.fn(async () => ({ deviceId: "dest-a", labels: [{ name: "Output 1" }] })),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "routes") return routesCollection;
            if (name === "sources") return sourcesCollection;
            if (name === "destinations") return destinationsCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        await expect(service("dest-a", 1, "src-a", 1)).rejects.toThrow("route update target not found");
    });
});

const mockMongoCollection = jest.fn();

jest.mock("@core/mongo-collection", () => (...args) => mockMongoCollection(...args));

const service = require("./destinations-list");

describe("destinations-list", () => {
    beforeEach(() => {
        mockMongoCollection.mockReset();
    });

    test("defaults to first destination device and marks missing route status", async () => {
        const devices = [{ name: "dest-a" }, { name: "dest-b" }];
        const destinationDoc = {
            deviceId: "dest-a",
            labels: [
                { index: 1, name: "Output 1", status: "OK" },
                { index: 2, name: "Output 2", status: "OK" },
            ],
        };
        const routesDoc = {
            deviceId: "dest-a",
            routes: [
                { destinationIndex: 1, sourceDevice: "src-a", sourceChannel: "Input 1", sourceIndex: 1 },
                { destinationIndex: 2, sourceDevice: "src-a", sourceChannel: "Input 2", sourceIndex: null },
            ],
        };

        const devicesCollection = {
            find: jest.fn(() => ({
                collation: jest.fn(() => ({
                    sort: jest.fn(() => ({
                        toArray: jest.fn(async () => devices),
                    })),
                })),
            })),
        };
        const routesCollection = {
            findOne: jest.fn(async () => routesDoc),
        };
        const destinationsCollection = {
            findOne: jest.fn(async () => destinationDoc),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "devices") return devicesCollection;
            if (name === "routes") return routesCollection;
            if (name === "destinations") return destinationsCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        const result = await service();

        expect(result.devices[0]).toMatchObject({ label: "dest-a", selected: true });
        expect(result.destinations[0]).toMatchObject({
            index: 1,
            sourceDevice: "src-a",
            sourceIndex: 1,
            status: "OK",
        });
        expect(result.destinations[1]).toMatchObject({
            index: 2,
            sourceDevice: "src-a",
            sourceIndex: null,
            status: "UNRESOLVED",
        });
    });

    test("prefers route status when present", async () => {
        const devices = [{ name: "dest-a" }];
        const destinationDoc = {
            deviceId: "dest-a",
            labels: [{ index: 1, name: "Output 1", status: "OK" }],
        };
        const routesDoc = {
            deviceId: "dest-a",
            routes: [
                { destinationIndex: 1, sourceDevice: "src-a", sourceChannel: "Input 1", sourceIndex: 1, status: "IN_PROGRESS" },
            ],
        };

        const devicesCollection = {
            find: jest.fn(() => ({
                collation: jest.fn(() => ({
                    sort: jest.fn(() => ({
                        toArray: jest.fn(async () => devices),
                    })),
                })),
            })),
        };
        const routesCollection = {
            findOne: jest.fn(async () => routesDoc),
        };
        const destinationsCollection = {
            findOne: jest.fn(async () => destinationDoc),
        };

        mockMongoCollection.mockImplementation(async (name) => {
            if (name === "devices") return devicesCollection;
            if (name === "routes") return routesCollection;
            if (name === "destinations") return destinationsCollection;
            throw new Error(`unexpected collection ${name}`);
        });

        const result = await service();

        expect(result.destinations[0]).toMatchObject({
            index: 1,
            sourceDevice: "src-a",
            sourceIndex: 1,
            status: "IN_PROGRESS",
        });
    });
});
